#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const options = readOptions(process.argv.slice(2));
const suiteStatuses = await readSuiteStatuses(options.statusFile);
const suites = await Promise.all(
  [...suiteStatuses.entries()].map(async ([language, runnerExitCode]) =>
    readSuite(options.resultsDir, language, runnerExitCode),
  ),
);
const summary = buildSummary(options.resultsDir, suites);
const markdown = renderMarkdown(summary);

await mkdir(options.resultsDir, { recursive: true });
await Promise.all([
  writeFile(join(options.resultsDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(join(options.resultsDir, "summary.md"), markdown),
]);

process.stdout.write(`\n${markdown}`);

if (options.check && summary.result !== "passed") {
  process.exitCode = 1;
}

function readOptions(argumentsList) {
  const options = { check: false, resultsDir: undefined, statusFile: undefined };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--check") {
      options.check = true;
      continue;
    }

    if (argument === "--results-dir" || argument === "--status-file") {
      const value = argumentsList[index + 1];
      if (!value) {
        throw new Error(`${argument} requires a value.`);
      }
      options[argument === "--results-dir" ? "resultsDir" : "statusFile"] = resolve(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  if (!options.resultsDir || !options.statusFile) {
    throw new Error("--results-dir and --status-file are required.");
  }

  return options;
}

async function readSuiteStatuses(statusFile) {
  const content = await readFile(statusFile, "utf8");
  const statuses = new Map();

  for (const line of content.split("\n")) {
    if (!line) continue;
    const [language, exitCode] = line.split("\t");
    if (!language || !/^\d+$/.test(exitCode ?? "")) {
      throw new Error(`Invalid suite status entry: ${line}`);
    }
    statuses.set(language, Number(exitCode));
  }

  return statuses;
}

async function readSuite(resultsDir, language, runnerExitCode) {
  const reportPath = join(resultsDir, language, "compatibility.json");

  try {
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    validateReport(report, reportPath);
    const targets = report.targets.map((target) => summarizeTarget(target));
    const hasFailures = targets.some((target) => target.failed > 0 || target.setupFailure);

    return {
      language,
      reportPath,
      runnerExitCode,
      run: report.run,
      result: hasFailures ? "issues" : "passed",
      targets,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      language,
      reportPath,
      result: "error",
      runnerExitCode,
      targets: [],
    };
  }
}

function validateReport(report, reportPath) {
  if (
    !isRecord(report) ||
    report.schemaVersion !== 1 ||
    !isRecord(report.suite) ||
    typeof report.suite.language !== "string" ||
    !Array.isArray(report.targets)
  ) {
    throw new Error(`Invalid compatibility report: ${reportPath}`);
  }
}

function summarizeTarget(target) {
  if (!isRecord(target) || !Array.isArray(target.testCases)) {
    throw new Error("Compatibility report target is invalid.");
  }

  const testCases = target.testCases;
  const failures = testCases
    .filter((testCase) => isRecord(testCase) && testCase.status === "failed")
    .map((testCase) => ({
      failure: isRecord(testCase.failure) ? testCase.failure.message : "No failure message was recorded.",
      id: testCase.id,
      parameters: isRecord(testCase.parameters) ? testCase.parameters : undefined,
    }));
  const advisories = testCases
    .filter((testCase) => isRecord(testCase) && isRecord(testCase.advisory))
    .map((testCase) => ({
      code: testCase.advisory.code,
      id: testCase.id,
      message: testCase.advisory.message,
      parameters: isRecord(testCase.parameters) ? testCase.parameters : undefined,
    }));
  const skippedCases = testCases
    .filter((testCase) => isRecord(testCase) && testCase.status === "skipped")
    .map((testCase) => ({
      id: testCase.id,
      parameters: isRecord(testCase.parameters) ? testCase.parameters : undefined,
      reason: typeof testCase.skipReason === "string"
        ? testCase.skipReason
        : "No skip reason was recorded.",
    }));

  return {
    advisories,
    failed: failures.length,
    failures,
    isCurrent: target.isCurrent === true,
    label: typeof target.label === "string" ? target.label : "unknown target",
    passed: testCases.filter((testCase) => isRecord(testCase) && testCase.status === "passed").length,
    sdkVersion: typeof target.sdkVersion === "string" ? target.sdkVersion : undefined,
    setupFailure: typeof target.setupFailure === "string" ? target.setupFailure : undefined,
    skipped: skippedCases.length,
    skippedCases,
  };
}

function buildSummary(resultsDir, suites) {
  const targets = suites.flatMap((suite) => suite.targets);
  const hasErrors = suites.some((suite) => suite.result === "error");
  const hasIssues = suites.some((suite) => suite.result === "issues");
  const targetBaseUrls = [...new Set(
    suites
      .map((suite) => suite.run?.targetBaseUrl)
      .filter((targetBaseUrl) => typeof targetBaseUrl === "string"),
  )];

  return {
    generatedAt: new Date().toISOString(),
    result: hasErrors ? "error" : hasIssues ? "issues" : "passed",
    resultsDirectory: resultsDir,
    schemaVersion: 1,
    suites,
    targetBaseUrls,
    totals: {
      failed: targets.reduce((total, target) => total + target.failed, 0),
      passed: targets.reduce((total, target) => total + target.passed, 0),
      skipped: targets.reduce((total, target) => total + target.skipped, 0),
      warnings: targets.reduce((total, target) => total + target.advisories.length, 0),
    },
  };
}

function renderMarkdown(summary) {
  const lines = [
    "# API SDK compatibility",
    "",
    `> **${summary.result.toUpperCase()}** — ${summary.totals.failed} failures, ${summary.totals.warnings} warnings, and ${summary.totals.skipped} skipped tests.`,
    ...(summary.targetBaseUrls.length > 0
      ? [`> Target${summary.targetBaseUrls.length === 1 ? "" : "s"}: ${summary.targetBaseUrls.map((url) => `\`${url}\``).join(", ")}`]
      : []),
    "",
    "## At a glance",
    "",
    "| Language | SDK target | Passed | Failed | Skipped | Warnings | Result |",
    "| --- | --- | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const suite of summary.suites) {
    if (suite.result === "error") {
      lines.push(`| ${suite.language} | — | 0 | — | 0 | 0 | error |`);
      continue;
    }

    for (const target of suite.targets) {
      const version = target.sdkVersion ? ` (${target.sdkVersion})` : "";
      const result = target.failed > 0 || target.setupFailure ? "issues" : "passed";
      lines.push(
        `| ${suite.language} | ${target.label}${version} | ${target.passed} | ${target.failed} | ${target.skipped} | ${target.advisories.length} | ${result} |`,
      );
    }
  }

  const suiteErrors = summary.suites.filter((suite) => suite.result === "error");
  if (suiteErrors.length > 0) {
    lines.push("", "## Suite errors");
    for (const suiteError of suiteErrors) {
      lines.push(`- ${suiteError.language}: ${suiteError.error}`);
    }
  }

  renderTargetGroups(lines, "Failures", summary.suites,
    (target) => target.failures.length > 0 || target.setupFailure,
    (suite, target) => {
      const details = [];
      if (target.setupFailure) {
        details.push(`- ${suite.language} / setup: ${firstLine(target.setupFailure)}`);
      }
      for (const { failure: message, id, parameters } of target.failures) {
        details.push(`- ${suite.language} / ${id}${formatParameters(parameters)}: ${firstLine(message)}`);
      }
      return details;
    },
    { open: true, noun: "failure" },
  );

  renderTargetGroups(lines, "Warnings", summary.suites,
    (target) => target.advisories.length > 0,
    (suite, target) => target.advisories.map(({ code, id, message, parameters }) =>
      `- ${suite.language} / ${id}${formatParameters(parameters)} [${code}]: ${firstLine(message)}`,
    ),
    { noun: "warning" },
  );

  renderTargetGroups(lines, "Skipped tests", summary.suites,
    (target) => target.skippedCases.length > 0,
    (suite, target) => target.skippedCases.map(({ id, parameters, reason }) =>
      `- ${suite.language} / ${id}${formatParameters(parameters)}: ${firstLine(reason)}`,
    ),
    { noun: "skipped test" },
  );

  lines.push("", `Artifacts: \`${summary.resultsDirectory}\``, "");
  return lines.join("\n");
}

function renderTargetGroups(lines, heading, suites, includeTarget, renderDetails, options = {}) {
  const groups = groupTargets(suites, includeTarget);
  if (groups.length === 0) return;

  lines.push("", `## ${heading}`);
  for (const group of groups) {
    const count = group.targets.reduce((total, { target }) => {
      if (heading === "Failures") return total + target.failures.length + Number(Boolean(target.setupFailure));
      if (heading === "Warnings") return total + target.advisories.length;
      return total + target.skippedCases.length;
    }, 0);
    const noun = count === 1 ? options.noun : `${options.noun}s`;
    lines.push("", `<details${options.open ? " open" : ""}>`, `<summary><strong>${group.label}</strong> — ${count} ${noun}</summary>`, "");
    for (const { suite, target } of group.targets) {
      lines.push(...renderDetails(suite, target));
    }
    lines.push("", "</details>");
  }
}

function groupTargets(suites, includeTarget) {
  const groups = new Map();

  for (const suite of suites) {
    for (const target of suite.targets) {
      if (!includeTarget(target)) continue;

      const label = targetLabel(target);
      const group = groups.get(label) ?? { label, targets: [] };
      group.targets.push({ suite, target });
      groups.set(label, group);
    }
  }

  return [...groups.values()];
}

function targetLabel(target) {
  return `${target.label}${target.sdkVersion ? ` (${target.sdkVersion})` : ""}`;
}

function formatParameters(parameters) {
  return parameters
    ? ` (${Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join(", ")})`
    : "";
}

function firstLine(value) {
  return String(value).split("\n", 1)[0];
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
