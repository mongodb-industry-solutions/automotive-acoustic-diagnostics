//
//  VehicleDetailView.swift
//  ios-app
//
//  Created by Rami Pinto on 20/11/24.
//

import Combine
import SwiftUI
struct VehicleDetailModel: Identifiable, Decodable {
    let id: String
    var LightsOn: Bool
    var Battery_Temp: Int
    var Battery_Current: Int
    var Battery_Status_OK: Bool
    var Vehicle_Name: String
    var Engine_Status: String
    var Driver_id: String
    var Driver_Door_Open: Bool
    var Hood_Open: Bool
    private enum CodingKeys: String, CodingKey {
        case id = "_id"
        case LightsOn
        case Battery_Temp
        case Battery_Current
        case Battery_Status_OK
        case Vehicle_Name
        case Engine_Status
        case Driver_id
        case Driver_Door_Open
        case Hood_Open
    }
}
@MainActor
class VehicleDetailViewModel: ObservableObject {
    @Published var vehicle: VehicleDetailModel?
    private var cancellables = Set<AnyCancellable>()
    private let vehicleId: String
    private var timer: Timer?
    
    init(vehicleId: String) {
        self.vehicleId = vehicleId
        startPolling()
    }
    
    private func startPolling() {
        fetchVehicleDetails() // Initial fetch
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            MainActor.assumeIsolated {
                self.fetchVehicleDetails()
            }
        }
    }
    
    deinit {
        timer?.invalidate()
    }
    
    private func fetchVehicleDetails() {
        guard let url = URL(string: "http://localhost:3000/api/action/findOne") else {
            print("Invalid URL")
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body: [String: Any] = [
            "collection": "vehicle_data",
            "filter": ["_id": vehicleId]
        ]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
//            .handleEvents(receiveOutput: { data in
//                            // Print the raw response data
//                            if let jsonString = String(data: data, encoding: .utf8) {
//                                print("Response JSON: \(jsonString)")
//                            } else {
//                                print("Failed to convert data to string")
//                            }
//                        })
            .decode(type: VehicleDetailModel.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    print("Error fetching vehicle details: \(error.localizedDescription)")
                }
            }, receiveValue: { [weak self] vehicle in
                self?.vehicle = vehicle
            })
            .store(in: &cancellables)
    }
    func toggleEngine() {
        guard let vehicle = vehicle else { return }
        let newLightsOn = !vehicle.LightsOn
        let newEngineStatus = newLightsOn ? "Running Normally" : "Engine Off"
        
        updateVehicleDetails(["LightsOn": newLightsOn, "Engine_Status": newEngineStatus]) { [weak self] success in
            if success {
                // Update the local state to reflect the change
                DispatchQueue.main.async {
                    self?.vehicle?.LightsOn = newLightsOn
                    self?.vehicle?.Engine_Status = newEngineStatus
                }
            }
        }
    }
    private func updateVehicleDetails(_ updates: [String: Any], completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: "http://localhost:3000/api/action/updateOne") else {
            print("Invalid URL")
            completion(false)
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body: [String: Any] = [
            "collection": "vehicle_data",
            "filter": ["_id": vehicleId],
            "update": ["$set": updates]
        ]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error updating vehicle details: \(error.localizedDescription)")
                completion(false)
            } else {
                print("Vehicle details updated successfully")
                completion(true)
            }
        }.resume()
    }
}
struct VehicleDetailView: View {
    @StateObject var viewModel: VehicleDetailViewModel
    var body: some View {
            Form {
                if let vehicle = viewModel.vehicle {
                    Section(header: Text("Attributes")) {
                        HStack {
                            Text("Vehicle Name")
                            Spacer()
                            Text(vehicle.Vehicle_Name)
                        }
                        HStack {
                            Text("Engine Status")
                            Spacer()
                            Text(vehicle.Engine_Status)
                        }
                    }
                    Section(header: Text("Controls")) {
                        Toggle(isOn: Binding(
                            get: { vehicle.LightsOn },
                            set: { _ in viewModel.toggleEngine() }
                        )) {
                            Text("Engine")
                        }
                    }
                    Section(header: Text("Battery")) {
                        HStack {
                            Text("Temperature")
                            Spacer()
                            Text("\(vehicle.Battery_Temp)°C")
                        }
                        HStack {
                            Text("Charge")
                            Spacer()
                            Text("\(vehicle.Battery_Current)%")
                        }
                        HStack {
                            Text("Status")
                            Spacer()
                            Image(systemName: isEngineStatusOK(vehicle.Engine_Status) ? "checkmark.circle.fill" : "exclamationmark.triangle.fill")
                                .foregroundColor(isEngineStatusOK(vehicle.Engine_Status) ? .green : .red)
                        }
                    }
                } else {
                    Text("Loading vehicle details...")
                }
            }
            .navigationBarTitle(viewModel.vehicle?.Vehicle_Name ?? "Vehicle Details")
            .navigationViewStyle(StackNavigationViewStyle())
    }
    
    private func isEngineStatusOK(_ status: String) -> Bool {
            return status == "Engine Off" || status == "Running Normally"
        }
}
struct VehicleDetailView_Previews: PreviewProvider {
    static var previews: some View {
        VehicleDetailView(viewModel: VehicleDetailViewModel(vehicleId: "658876fde27a68ff985cdb4d"))
    }
}
