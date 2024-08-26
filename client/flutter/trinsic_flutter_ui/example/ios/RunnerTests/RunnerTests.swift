import Flutter
import UIKit
import XCTest

@testable import connect_flutter

class RunnerTests: XCTestCase {

  func testGetPlatformVersion() {
    let plugin = TrinsicFlutterUIPlugin()

    let call = FlutterMethodCall(methodName: "getPlatformVersion", arguments: [])

    let resultExpectation = expectation(description: "result block must be called.")
    plugin.handle(call) { result in
      XCTAssertEqual(result as! String, "iOS " + UIDevice.current.systemVersion)
      resultExpectation.fulfill()
    }
    waitForExpectations(timeout: 1)
  }

}
