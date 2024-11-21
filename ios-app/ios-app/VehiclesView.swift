//
//  VehiclesView.swift
//  ios-app
//
//  Created by Rami Pinto on 19/11/24.
//
import Combine
import SwiftUI

struct VehicleModel: Identifiable, Decodable {
    let id: String
    let Vehicle_Name: String
    
    // Map the JSON key "_id" to the "id" property
    private enum CodingKeys: String, CodingKey {
        case id = "_id"
        case Vehicle_Name
    }
}
@MainActor
class VehiclesViewModel: ObservableObject {
    @Published var vehicles = [VehicleModel]()
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        fetchVehicles()
    }
    
    private func fetchVehicles() {
        guard let url = URL(string: "http://localhost:3000/api/action/find") else {
            print("Invalid URL")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "collection": "vehicle_data",
            "filter": [:],
            "projection": ["Vehicle_Name": 1]
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
            .handleEvents(receiveOutput: { data in
                            // Print the raw response data
                            if let jsonString = String(data: data, encoding: .utf8) {
                                print("Response JSON: \(jsonString)")
                            } else {
                                print("Failed to convert data to string")
                            }
                        })
            .decode(type: [VehicleModel].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    print("Error fetching vehicles: \(error.localizedDescription)")
                }
            }, receiveValue: { [weak self] vehicles in
                self?.vehicles = vehicles
            })
            .store(in: &cancellables)
    }
}
struct VehiclesView: View {
    @StateObject var viewModel = VehiclesViewModel()
    
    var body: some View {
        NavigationView {
            List {
                if viewModel.vehicles.isEmpty {
                    Text("No vehicles found.")
                        .foregroundColor(.gray)
                } else {
                    ForEach(viewModel.vehicles) { vehicle in
                        NavigationLink(destination: DefaultView()) {
                            Text(vehicle.Vehicle_Name)
                        }
                    }
                }
            }
            .navigationTitle("Vehicles")
            .onAppear {
                print("VehiclesView - Vehicle count: \(viewModel.vehicles.count)")
            }
        }
    }
}

#Preview {
    VehiclesView()
}
