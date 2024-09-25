const path = require("path");
module.exports = {
  entry: "./src/index.js", // Entry point
  output: {
    filename: "bundle.js", // Output file
    path: path.resolve(__dirname, "dist"),
    strictModuleErrorHandling: true,
  },
  stats: {
    warningsFilter: (warning) => {
      //We don't want any warnings
      throw new Error(warning);
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    compress: true,
    port: 9000, // Dev server port
  },
  bail: true,
  mode: "development", // Set the mode to development
};
