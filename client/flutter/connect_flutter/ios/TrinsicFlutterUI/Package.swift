// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "TrinsicFlutterUI",
    products: [
        .library(
            name: "TrinsicFlutterUI",
            targets: ["TrinsicFlutterUI"]),
    ],
    dependencies: [
        // Here you add your dependencies
        .package(path: "../../../../../swift/ui"),
        // You can add multiple dependencies in this array
    ],
    targets: [
        .target(
            name: "TrinsicFlutterUI",
            dependencies: [
                .product(name: "TrinsicUI", package: "ui")
            ]),
    ]
)
