//
//  ContentView.swift
//  ui-ios-sample
//
//  Created by Jan-Pieter George on 8/21/24.
//

import SwiftUI
import AuthenticationServices
import TrinsicUI


struct ContentView: View {
    @State private var isButtonEnabled = false
    @State private var redirectedURL: URL?
    let trinsicUI = TrinsicUI()
    let startUrl =  "https://api.trinsic-development.com/connect/launch-test?authToken=CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEkkKK3Vybjp0cmluc2ljOndhbGxldHM6eldWcFpVdWJVV1ZaTHJZcXBUM1pTa3ciGnVybjp0cmluc2ljOmVjb3N5c3RlbXM6aWR2GjCV/9d67y0X9vdWRbL62YswBC8drOGXO/KQqBlZGRa0OUZ307fltCgpmOKWrP2UyqwiAA%3D%3D&idvProvierSelection=trinsicfake&noRedirect=true"
    
    
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, world!")
            Button(action: {
                Task {
                    await handleButtonClick()
                }
            }) {
                Text("Click Me")
            }
                .disabled(!isButtonEnabled)
                .onAppear {
                    fetchData(from: startUrl) { result in
                        switch result {
                        case .success(let content):
                            print("Got url \(content)");
                            redirectedURL = URL(string: content)
                            isButtonEnabled = true
                        case .failure(let error):
                            print("Error fetching data: \(error.localizedDescription)")
                        }
                    }
                }
        }
        .padding()
    }
    
    func handleButtonClick() async {
        do {
            // Handle the button click, using redirectedURL if needed
            if let url = redirectedURL {
                
                print("Button clicked, opening: \(url)")
                let window = getWindow()
                guard window != nil else {
                    return;
                }
                let resultUrl = try await trinsicUI.launchSession(launchUrl: url.absoluteString, callbackURL: "trinsic-aui-ios://custom-callback")
                print("Result url \(resultUrl)")
                // Call another function here if needed
            }
        }
        catch {
            print("Error: \(error)")
        }
        
    }
    
    func getWindow() -> UIWindow? {
        let scenes = UIApplication.shared.connectedScenes
                
                for scene in scenes {
                    if let windowScene = scene as? UIWindowScene {
                        for window in windowScene.windows where window.isKeyWindow {
                            return window
                        }
                    }
                }
                return nil
    }
}

func fetchData(from urlString: String, completion: @escaping (Result<String, Error>) -> Void) {
    guard let url = URL(string: urlString) else {
        completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])))
        return
    }

    let task = URLSession.shared.dataTask(with: url) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }

        guard let data = data, let content = String(data: data, encoding: .utf8) else {
            completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid Data"])))
            return
        }

        completion(.success(content))
    }

    task.resume()
}

#Preview {
    ContentView()
}
