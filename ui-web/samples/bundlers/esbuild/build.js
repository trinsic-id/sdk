// build.js
require("esbuild")
  .build({
    entryPoints: ["index.js"],
    bundle: true,
    outfile: "dist/bundle.js",
  })
  .catch(() => process.exit(1));
