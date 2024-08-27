import SwiftUI
import AuthenticationServices
import TrinsicUI


struct ContentView: View {
    @State private var isButtonEnabled = false
    @State private var redirectedURL: URL?
    // Pick between our default one presentationContextProvider
    let trinsicUI = TrinsicUI()
    // Or a customized one that you can provide yourself
    //let trinsicUI = TrinsicUI(presentationContextProvider: CustomContextProvider.init())
    
    let startUrl =  ""
    
    
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
                    //Change this to a function that gets a launch url from a backend you control
                    fetchLaunchUrlFromTrinsicBackend(from: startUrl) { result in
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
            if let url = redirectedURL {
                
                print("Button clicked, opening: \(url)")
                
                let result = try await trinsicUI.launchSession(launchUrl: url.absoluteString, callbackURL: "trinsic-ui-ios://custom-auth-callback/")
                print("Success \(result.success)")
                print("Canceled \(result.canceled)")
                print("Session id \(String(describing: result.sessionId))")
                print("Result key \(String(describing: result.resultsAccessKey))")
            }
        }
        catch {
            print("Error: \(error)")
        }
        
    }
}

//You should provide a backend function yourself that generates a launch url with your (protected) auth token. This is here for a Trinsic protected backend server to easily generate a test url, but you should not use that.
func fetchLaunchUrlFromTrinsicBackend(from urlString: String, completion: @escaping (Result<String, Error>) -> Void) {
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
