//
//  DefaultView.swift
//  ios-app
//
//  Created by Rami Pinto on 19/11/24.
//

import SwiftUI

struct DefaultView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, world!")
        }
        .padding()
    }
}

#Preview {
    DefaultView()
}
