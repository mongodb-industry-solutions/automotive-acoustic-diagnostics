//
//  LoginView.swift
//  ios-app
//
//  Created by Rami Pinto on 19/11/24.
//

import SwiftUI

struct LoginView: View {
    // Hold an error if one occurs so we can display it.
    @State var error: Error?
    @State var username: String = "demo"
    @State var password: String = "demopw"
    
    
    // Keep track of whether login is in progress.
    @State var isLoggingIn = false
    
    // This will be used to trigger the navigation.
    @State private var navigateToNextScreen = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Image("LoginBack")
                    .resizable()
                    .scaledToFit()
                    .frame(maxWidth: .infinity)
                    .padding(.top, 0)
                Text("Welcome to the Vehicle Controller")
                    .font(.title)
                    .fontWeight(.medium)
                    .multilineTextAlignment(.center)
                    .padding(.bottom, 25)
                    .padding(.top, 25)
                
                VStack(spacing: 15) {
                    TextField("Username", text: $username)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal)
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal)
                    
                    Button("Login") {
                        // Button pressed, so log in
                        isLoggingIn = true
                        
                        // Wait for 1 second and then navigate
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            isLoggingIn = false
                            navigateToNextScreen = true
                        }
                    }
                    .disabled(isLoggingIn)
                    .padding()
                    .foregroundColor(.accentColor)
                    .cornerRadius(8)
                    .padding(.horizontal)
                }
                
                if isLoggingIn {
                    ProgressView()
                }
                if let error = error {
                    Text("Error: \(error.localizedDescription)")
                }
                
                Spacer()
                
                HStack{
                    Text("Powered by ")
                        .font(.caption)
                        .multilineTextAlignment(.center)
                        .padding(.bottom, 25)
                    Image("LoginAtlas")
                        .padding(.bottom, 25)
                        .imageScale(.small)
                }
                
                .navigationDestination(isPresented: $navigateToNextScreen) {
                    VehiclesView()
                }
                .padding()
            }
        }
    }
}
