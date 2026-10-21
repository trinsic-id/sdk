#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  throw new Error("Usage: prepare-pso-pdf.mjs <input.html> <output.html>");
}

const html = await readFile(inputPath, "utf8");
const printCss = `
<style>
@media print {
  #markdown-content > .md-block:has(> h2) {
    break-before: page;
    page-break-before: always;
  }
}
</style>`;

if (!html.includes("</head>")) {
  throw new Error(`Cannot add print styles: ${inputPath} has no </head> element.`);
}

await writeFile(outputPath, html.replace("</head>", `${printCss}\n</head>`));
