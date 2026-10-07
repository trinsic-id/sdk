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
const apiCoverageMarkdown = summary.apiCoverages.length > 0
  ? renderApiCoverageMarkdown(summary)
  : undefined;

await mkdir(options.resultsDir, { recursive: true });
const writes = [
  writeFile(join(options.resultsDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(join(options.resultsDir, "summary.md"), markdown),
];
if (summary.apiCoverages.length > 0 && apiCoverageMarkdown) {
  writes.push(
    writeFile(
      join(options.resultsDir, "api-coverage.json"),
      `${JSON.stringify({ schemaVersion: 1, suites: summary.apiCoverages }, null, 2)}\n`,
    ),
    writeFile(join(options.resultsDir, "api-coverage.md"), apiCoverageMarkdown),
  );
}
await Promise.all(writes);

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
      apiCoverage: readApiCoverage(report.apiCoverage),
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

function readApiCoverage(value) {
  if (!isRecord(value) || !Array.isArray(value.operations)) {
    return undefined;
  }

  const operations = value.operations.filter((operation) =>
    isRecord(operation)
    && typeof operation.covered === "boolean"
    && typeof operation.method === "string"
    && typeof operation.operationId === "string"
    && typeof operation.path === "string"
    && Array.isArray(operation.testCaseIds)
    && operation.testCaseIds.every((id) => typeof id === "string"),
  );
  if (operations.length !== value.operations.length) {
    return undefined;
  }

  return {
    covered: typeof value.covered === "number" ? value.covered : 0,
    operations,
    total: typeof value.total === "number" ? value.total : operations.length,
    unmappedTestCaseIds: Array.isArray(value.unmappedTestCaseIds)
      ? value.unmappedTestCaseIds.filter((id) => typeof id === "string")
      : [],
  };
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
  const outcomes = testCases
    .filter((testCase) =>
      isRecord(testCase)
      && typeof testCase.id === "string"
      && ["passed", "failed", "skipped"].includes(testCase.status)
      && isComparableOutcome(testCase),
    )
    .map((testCase) => ({
      detail: testCase.status === "failed"
        ? (isRecord(testCase.failure) ? testCase.failure.message : "No failure message was recorded.")
        : testCase.status === "skipped"
          ? (typeof testCase.skipReason === "string" ? testCase.skipReason : "No skip reason was recorded.")
          : undefined,
      id: testCase.id,
      parameters: isRecord(testCase.parameters) ? testCase.parameters : undefined,
      status: testCase.status,
    }));
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
  const providerOutputCases = testCases.filter((testCase) =>
    isRecord(testCase)
    && testCase.id === "serialization.provider-output-round-trip"
    && isRecord(testCase.parameters)
    && typeof testCase.parameters.providerId === "string",
  );
  const providerOutputs = {
    failed: providerOutputCases.filter((testCase) => testCase.status === "failed").map((testCase) => ({
      message: isRecord(testCase.failure) ? testCase.failure.message : "No failure message was recorded.",
      providerId: testCase.parameters.providerId,
      sdkModelName: testCase.parameters.sdkModelName,
    })),
    passed: providerOutputCases.filter((testCase) => testCase.status === "passed").length,
    skipped: providerOutputCases.filter((testCase) => testCase.status === "skipped").map((testCase) => ({
      providerId: testCase.parameters.providerId,
      reason: typeof testCase.skipReason === "string" ? testCase.skipReason : "No skip reason was recorded.",
      sdkModelName: testCase.parameters.sdkModelName,
    })),
  };

  return {
    advisories,
    failed: failures.length,
    failures,
    isCurrent: target.isCurrent === true,
    label: typeof target.label === "string" ? target.label : "unknown target",
    outcomes,
    passed: testCases.filter((testCase) => isRecord(testCase) && testCase.status === "passed").length,
    providerOutputs,
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
  const apiCoverages = suites
    .filter((suite) => suite.apiCoverage !== undefined)
    .map((suite) => ({ coverage: suite.apiCoverage, language: suite.language }));

  return {
    apiCoverages,
    generatedAt: new Date().toISOString(),
    languageComparisons: buildLanguageComparisons(suites),
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

function buildLanguageComparisons(suites) {
  const comparisons = new Map();

  for (const suite of suites) {
    for (const target of suite.targets) {
      const key = comparisonTargetKey(target);
      const comparison = comparisons.get(key) ?? {
        key,
        label: comparisonTargetLabel(target),
        languages: new Set(),
        outcomes: new Map(),
      };
      comparison.languages.add(suite.language);
      for (const outcome of target.outcomes) {
        const outcomeKey = `${outcome.id}\u0000${stableParameters(outcome.parameters)}`;
        const entries = comparison.outcomes.get(outcomeKey) ?? [];
        entries.push({ language: suite.language, ...outcome });
        comparison.outcomes.set(outcomeKey, entries);
      }
      comparisons.set(key, comparison);
    }
  }

  return [...comparisons.values()]
    .filter((comparison) => comparison.languages.size > 1)
    .map((comparison) => {
      const differences = [];
      for (const entries of comparison.outcomes.values()) {
        const statuses = new Set(entries.map((entry) => entry.status));
        const details = new Set(
          entries
            .filter((entry) => entry.status === "failed")
            .map((entry) => entry.detail)
            .filter(Boolean),
        );
        const type = entries.length !== comparison.languages.size
          ? "missing"
          : statuses.size > 1
            ? "status"
            : details.size > 1
              ? "detail"
              : undefined;
        if (type) differences.push({ entries, type });
      }
      return {
        differences,
        label: comparison.label,
        languages: [...comparison.languages].sort(),
      };
    })
    .filter((comparison) => comparison.differences.length > 0);
}

function comparisonTargetKey(target) {
  if (!target.isCurrent) return `published:${target.sdkVersion ?? target.label}`;
  if (target.label === "current branch") return "current-branch";
  if (target.label.startsWith("origin/main")) return "origin-main";
  return `current:${target.label}`;
}

function comparisonTargetLabel(target) {
  if (!target.isCurrent) return `published SDK ${target.sdkVersion ?? target.label}`;
  if (target.label === "current branch") return "current branch";
  if (target.label.startsWith("origin/main")) return target.label;
  return targetLabel(target);
}

function stableParameters(parameters) {
  if (!parameters) return "";
  return JSON.stringify(Object.entries(parameters).sort(([left], [right]) => left.localeCompare(right)));
}

function isComparableOutcome(testCase) {
  if (testCase.id.startsWith("framework.")) return false;
  return !isRecord(testCase.parameters) || testCase.parameters.scope !== "catalog";
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

  if (summary.apiCoverages.length > 0) {
    lines.push("", ...renderApiCoverageLines(summary));
  }

  renderLanguageComparisons(lines, summary.languageComparisons);

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
        details.push(`- setup: ${firstLine(target.setupFailure)}`);
      }
      for (const { failure: message, id, parameters } of target.failures) {
        details.push(`- ${id}${formatParameters(parameters)}: ${firstLine(message)}`);
      }
      return details;
    },
    { open: true, noun: "failure" },
  );

  renderTargetGroups(lines, "Warnings", summary.suites,
    (target) => target.advisories.length > 0,
    (suite, target) => target.advisories.map(({ code, id, message, parameters }) =>
      `- ${id}${formatParameters(parameters)} [${code}]: ${firstLine(message)}`,
    ),
    { noun: "warning" },
  );

  renderTargetGroups(lines, "Skipped tests", summary.suites,
    (target) => target.skippedCases.length > 0,
    (suite, target) => target.skippedCases.map(({ id, parameters, reason }) =>
      `- ${id}${formatParameters(parameters)}: ${firstLine(reason)}`,
    ),
    { noun: "skipped test" },
  );

  lines.push("", `Artifacts: \`${summary.resultsDirectory}\``, "");
  return lines.join("\n");
}

function renderLanguageComparisons(lines, comparisons) {
  if (comparisons.length === 0) return;

  lines.push(
    "",
    "## Cross-SDK outcome differences",
    "",
    "> Equivalent targets are compared across SDK languages by test ID and parameters. Differences include a missing result, a different pass/fail/skip status, or different failure/skip details for the same status.",
    "",
    "| Target | Languages | Differences |",
    "| --- | --- | ---: |",
  );
  for (const comparison of comparisons) {
    lines.push(`| ${comparison.label} | ${comparison.languages.join(", ")} | ${comparison.differences.length} |`);
  }

  for (const comparison of comparisons) {
    lines.push("", "<details open>", `<summary><strong>${comparison.label}</strong> — ${comparison.differences.length} differing outcomes</summary>`, "");
    for (const difference of comparison.differences) {
      const exemplar = difference.entries[0];
      const label = `\`${exemplar.id}\`${formatParameters(exemplar.parameters)}`;
      const entries = difference.entries
        .map((entry) => `${entry.language}: **${entry.status}**${entry.detail ? ` — ${firstLine(entry.detail)}` : ""}`)
        .join("; ");
      const missingLanguages = comparison.languages.filter((language) => !difference.entries.some((entry) => entry.language === language));
      lines.push(`- ${label}${difference.type === "missing" ? ` — missing from ${missingLanguages.join(", ")}; ` : " — "}${entries}`);
    }
    lines.push("", "</details>");
  }
}

function renderApiCoverageMarkdown(summary) {
  return `${renderApiCoverageLines(summary).join("\n")}\n`;
}

function renderApiCoverageLines(summary) {
  const lines = ["## API operation coverage"];

  for (const { coverage, language } of summary.apiCoverages) {
    if (summary.apiCoverages.length > 1) {
      lines.push("", `### ${language}`);
    }
    lines.push("", ...renderSingleApiCoverageLines(coverage));
  }

  const providerOutputTargets = summary.suites.flatMap((suite) =>
    suite.targets
      .filter((target) => target.providerOutputs)
      .map((target) => ({ suite, target })),
  );
  if (providerOutputTargets.length > 0) {
    lines.push(
      "",
      "## Provider-specific output coverage",
      "",
      "| Language | SDK target | Passed | Failed | Skipped |",
      "| --- | --- | ---: | ---: | ---: |",
    );
    for (const { suite, target } of providerOutputTargets) {
      const providerOutputs = target.providerOutputs;
      lines.push(
        `| ${suite.language} | ${targetLabel(target)} | ${providerOutputs.passed} | ${providerOutputs.failed.length} | ${providerOutputs.skipped.length} |`,
      );
    }

    for (const suite of summary.suites) {
      const languageTargets = providerOutputTargets.filter(({ suite: targetSuite }) => targetSuite === suite);
      if (languageTargets.length === 0) continue;

      lines.push("", `### ${suite.language}`);
      for (const { target } of languageTargets) {
        const providerOutputs = target.providerOutputs;
        if (providerOutputs.failed.length === 0) continue;

        lines.push("", "<details open>", `<summary><strong>${targetLabel(target)}</strong> — ${providerOutputs.failed.length} PSO failures</summary>`, "");
        const failureGroups = groupPsoFailures(providerOutputs.failed);
        lines.push("| Failure type | Count |", "| --- | ---: |");
        for (const group of failureGroups) {
          lines.push(`| ${group.label} | ${group.failures.length} |`);
        }
        for (const group of failureGroups) {
          lines.push("", `#### ${group.label} (${group.failures.length})`, "");
          for (const { message, providerId, sdkModelName } of group.failures) {
            lines.push(`- \`${providerId}\`${sdkModelName ? ` (${sdkModelName})` : ""}: ${firstLine(message)}`);
          }
        }
        lines.push("", "</details>");
      }

      for (const { target } of languageTargets) {
        const providerOutputs = target.providerOutputs;
        if (providerOutputs.skipped.length === 0) continue;

        lines.push("", "<details>", `<summary><strong>${targetLabel(target)}</strong> — ${providerOutputs.skipped.length} skipped PSO fixtures</summary>`, "");
        for (const { providerId, reason, sdkModelName } of providerOutputs.skipped) {
          lines.push(`- \`${providerId}\`${sdkModelName ? ` (${sdkModelName})` : ""}: ${firstLine(reason)}`);
        }
        lines.push("", "</details>");
      }
    }
  }

  return lines;
}

function groupPsoFailures(failures) {
  const groups = new Map();
  for (const failure of failures) {
    const type = classifyPsoFailure(failure.message);
    const group = groups.get(type.label) ?? { ...type, failures: [] };
    group.failures.push(failure);
    groups.set(type.label, group);
  }
  return [...groups.values()].sort((left, right) =>
    left.order - right.order || left.label.localeCompare(right.label),
  );
}

function classifyPsoFailure(message) {
  const normalized = String(message).toLowerCase();

  if (normalized.includes("does not export") || normalized.includes("does not expose")) {
    return { label: "Missing public SDK model", order: 10 };
  }
  if (normalized.includes("returned http") || normalized.includes("test-support endpoint")) {
    return { label: "Fixture retrieval failure", order: 20 };
  }
  if (
    normalized.includes("validation error")
    || normalized.includes("input should be")
    || normalized.includes("cannot deserialize")
  ) {
    return { label: "Deserialization failure", order: 30 };
  }
  if (
    normalized.includes("drops wire field")
    || normalized.includes("field names differ")
    || normalized.includes("emitted field")
    || normalized.includes("missing field")
  ) {
    return { label: "Field mismatch", order: 50 };
  }
  if (
    normalized.includes("as object but")
    || normalized.includes("as an object but")
    || normalized.includes("as an object, but")
    || normalized.includes("as an array, but")
    || normalized.includes("expected object")
    || normalized.includes("expected array")
    || normalized.includes("model shape")
  ) {
    return { label: "Model shape mismatch", order: 60 };
  }
  if (
    normalized.includes("to_dict")
    || normalized.includes("tojson")
    || normalized.includes("serialize")
    || normalized.includes("serialization")
  ) {
    return { label: "Serialization failure", order: 40 };
  }
  if (
    normalized.includes("round-trip produced")
    || normalized.includes("wire fixture contains")
    || normalized.includes("value differs")
  ) {
    return { label: "Value mismatch", order: 70 };
  }
  return { label: "Other round-trip failure", order: 99 };
}

function renderSingleApiCoverageLines(coverage) {
  const coveredOperations = coverage.operations.filter((operation) => operation.covered);
  const uncoveredOperations = coverage.operations.filter((operation) => !operation.covered);
  const percentage = coverage.total === 0
    ? "0.0"
    : ((coverage.covered / coverage.total) * 100).toFixed(1);
  const lines = [
    `> **${coverage.covered} of ${coverage.total} operations covered (${percentage}%).** Coverage is mapped from the compatibility-test catalog to the Swagger contract used for this run.`,
    "",
    "<details open>",
    `<summary><strong>Covered operations</strong> — ${coveredOperations.length}</summary>`,
    "",
    "| Method | Path | Operation | Compatibility test |",
    "| --- | --- | --- | --- |",
  ];

  for (const operation of coveredOperations) {
    lines.push(
      `| ${operation.method} | \`${operation.path}\` | \`${operation.operationId}\` | ${operation.testCaseIds.map((id) => `\`${id}\``).join(", ")} |`,
    );
  }
  lines.push("", "</details>", "", "<details>", `<summary><strong>Untested operations</strong> — ${uncoveredOperations.length}</summary>`, "");

  if (uncoveredOperations.length === 0) {
    lines.push("All Swagger operations have a mapped compatibility test.");
  } else {
    lines.push("| Method | Path | Operation |", "| --- | --- | --- |");
    for (const operation of uncoveredOperations) {
      lines.push(`| ${operation.method} | \`${operation.path}\` | \`${operation.operationId}\` |`);
    }
  }
  lines.push("", "</details>");

  if (coverage.unmappedTestCaseIds.length > 0) {
    lines.push(
      "",
      `> Catalog entries without a Swagger operation: ${coverage.unmappedTestCaseIds.map((id) => `\`${id}\``).join(", ")}.`,
    );
  }

  return lines;
}

function renderTargetGroups(lines, heading, suites, includeTarget, renderDetails, options = {}) {
  const languageGroups = suites
    .map((suite) => ({ suite, targets: suite.targets.filter(includeTarget) }))
    .filter((group) => group.targets.length > 0);
  if (languageGroups.length === 0) return;

  lines.push("", `## ${heading}`);
  for (const { suite, targets } of languageGroups) {
    lines.push("", `### ${suite.language}`);
    for (const target of targets) {
      const count = heading === "Failures"
        ? target.failures.length + Number(Boolean(target.setupFailure))
        : heading === "Warnings"
          ? target.advisories.length
          : target.skippedCases.length;
      const noun = count === 1 ? options.noun : `${options.noun}s`;
      lines.push("", `<details${options.open ? " open" : ""}>`, `<summary><strong>${targetLabel(target)}</strong> — ${count} ${noun}</summary>`, "");
      lines.push(...renderDetails(suite, target));
      lines.push("", "</details>");
    }
  }
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
