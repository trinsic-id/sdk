const path = require("path");

module.exports = {
  entry: "./src/index.js", // Entry point
  output: {
    filename: "bundle.js", // Output file
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Serve from dist folder
    },
    compress: true,
    port: 9000, // Dev server port
  },
  mode: "development", // Set the mode to development
  //   resolve: {
  //     mainFields: ["module", "main"],
  //     extensions: [".js", ".mjs"], // ESM extensions
  //   },
};
