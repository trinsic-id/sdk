//
//  ContentView.swift
//  ui-macos-sample
//
//  Created by Jan-Pieter George on 8/21/24.
//

import SwiftUI
import TrinsicUI

struct ContentView: View {
    let trinsicUI = TrinsicApi()
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text(trinsicUI.sayHello())
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
