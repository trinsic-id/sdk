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
    ],
    targets: [
        .target(
            name: "TrinsicFlutterUI",
            dependencies: [
                .product(name: "TrinsicUI", package: "ui")
            ]),
    ]
)
