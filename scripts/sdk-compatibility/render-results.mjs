#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const options = readOptions(process.argv.slice(2));
const acknowledgements = await readAcknowledgements();
const suiteStatuses = await readSuiteStatuses(options.statusFile);
const suites = await Promise.all(
  [...suiteStatuses.entries()].map(async ([language, runnerExitCode]) =>
    readSuite(options.resultsDir, language, runnerExitCode, acknowledgements),
  ),
);
const summary = buildSummary(options.resultsDir, suites);
const markdown = renderMarkdown(summary);
const apiSummaryMarkdown = renderApiSummaryMarkdown(summary);
const psoSummaryMarkdown = renderPsoSummaryMarkdown(summary);
const psoChartVariationsMarkdown = renderPsoChartVariationsMarkdown(summary);
const apiCoverageMarkdown = summary.apiCoverages.length > 0
  ? renderApiCoverageMarkdown(summary)
  : undefined;

await mkdir(options.resultsDir, { recursive: true });
const writes = [
  writeFile(join(options.resultsDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
  writeFile(join(options.resultsDir, "summary.md"), markdown),
  writeFile(join(options.resultsDir, "api-summary.md"), apiSummaryMarkdown),
  writeFile(join(options.resultsDir, "pso-summary.md"), psoSummaryMarkdown),
  writeFile(join(options.resultsDir, "pso-chart-variations.md"), psoChartVariationsMarkdown),
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

async function readSuite(resultsDir, language, runnerExitCode, acknowledgements) {
  const reportPath = join(resultsDir, language, "compatibility.json");

  try {
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    validateReport(report, reportPath);
    const targets = report.targets.map((target) => summarizeTarget(target, language, acknowledgements));
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

async function readAcknowledgements() {
  const compatibilityPath = fileURLToPath(new URL("../../compatibility.json", import.meta.url));
  const compatibility = JSON.parse(await readFile(compatibilityPath, "utf8"));
  const entries = compatibility?.compatibility?.acknowledgements ?? [];

  if (!Array.isArray(entries)) {
    throw new Error("compatibility.acknowledgements must be an array.");
  }

  return entries.map((entry, index) => {
    if (
      !isRecord(entry)
      || typeof entry.language !== "string"
      || typeof entry.reason !== "string"
      || typeof entry.sdkVersion !== "string"
      || typeof entry.testCaseId !== "string"
      || (entry.mute !== undefined && typeof entry.mute !== "boolean")
      || (entry.parameters !== undefined && (!isRecord(entry.parameters)
        || !Object.values(entry.parameters).every((value) => typeof value === "string")))
    ) {
      throw new Error(`Invalid compatibility acknowledgement at index ${index}.`);
    }

    return entry;
  });
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

function summarizeTarget(target, language, acknowledgements) {
  if (!isRecord(target) || !Array.isArray(target.testCases)) {
    throw new Error("Compatibility report target is invalid.");
  }

  const testCases = applyAcknowledgements(target.testCases, target, language, acknowledgements);
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

function applyAcknowledgements(testCases, target, language, acknowledgements) {
  return testCases.map((testCase) => {
    if (!isRecord(testCase) || typeof testCase.id !== "string") return testCase;
    if (testCase.status !== "failed" && !isRecord(testCase.advisory)) return testCase;

    const matches = acknowledgements.filter((acknowledgement) =>
      acknowledgement.language === language
      && acknowledgement.sdkVersion === target.sdkVersion
      && acknowledgement.testCaseId === testCase.id
      && acknowledgementParametersMatch(acknowledgement.parameters, testCase.parameters),
    );
    if (matches.length === 0) return testCase;
    if (matches.length > 1) {
      throw new Error(`Multiple acknowledgements match ${language} ${target.sdkVersion ?? target.label} ${testCase.id}.`);
    }

    const acknowledgement = matches[0];
    const originalMessage = testCase.status === "failed"
      ? (isRecord(testCase.failure) && typeof testCase.failure.message === "string"
        ? testCase.failure.message
        : "No failure message was recorded.")
      : (typeof testCase.advisory.message === "string"
        ? testCase.advisory.message
        : "No warning message was recorded.");
    const advisory = {
      code: "acknowledged-compatibility-exception",
      message: `${acknowledgement.reason} Original result: ${originalMessage}`,
    };

    if (testCase.status === "failed") {
      const { advisory: _advisory, failure: _failure, ...withoutFailure } = testCase;
      return {
        ...withoutFailure,
        ...(acknowledgement.mute ? {} : { advisory }),
        skipReason: `Acknowledged compatibility exception: ${acknowledgement.reason}`,
        status: "skipped",
      };
    }

    if (acknowledgement.mute) {
      const { advisory: _advisory, ...withoutAdvisory } = testCase;
      return withoutAdvisory;
    }
    return { ...testCase, advisory };
  });
}

function acknowledgementParametersMatch(expected, actual) {
  if (expected === undefined) return true;
  if (!isRecord(actual)) return false;
  return Object.entries(expected).every(([key, value]) => actual[key] === value);
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

function renderPsoSummaryMarkdown(summary) {
  const providers = buildPsoProviderRollup(summary.suites);
  const fence = String.fromCharCode(96).repeat(3);
  const code = String.fromCharCode(96);
  const lines = [];
  if (providers.length === 0) return lines.concat(["", "No PSO failures were reported.", ""]).join("\n");

  for (const [index, providerGroup] of splitProvidersForCharts(providers, providers.length).entries()) {
    const start = index * providers.length + 1;
    const end = start + providerGroup.length - 1;
    lines.push(
      fence + "echarts",
      JSON.stringify(buildPsoFailureTypeChart(providerGroup, {
        start,
        end,
        subtitle: providers.length + " providers; each segment is a failing language/SDK-target outcome",
        title: "Provider Specific Output Summary",
      }), null, 2),
      fence,
    );
  }
  lines.push(
    "",
    "## By provider",
    "",
    "| Provider | Failing outcomes | SDK languages | Failure types |",
    "| --- | ---: | --- | --- |",
    ...providers.map((provider) =>
      "| " + code + provider.providerId + code + " | " + provider.failureCount + " | "
      + provider.languages.join(", ") + " | " + provider.failureTypes.join(", ") + " |"),
  );
  for (const provider of providers) {
    const affectedTargets = summarizeProviderTargets(provider.failures);
    lines.push(
      "",
      "## " + code + provider.providerId + code,
      "",
      "**Failing outcomes:** " + provider.failureCount,
      "",
      "**SDK languages:** " + provider.languages.join(", "),
      "",
      "**Failure types:** " + provider.failureTypes.join(", "),
      "",
      "#### Affected targets",
      "",
      "| SDK language | SDK target | Failing outcomes |",
      "| --- | --- | ---: |",
      ...affectedTargets.map((target) => "| " + target.language + " | " + target.target + " | " + target.failureCount + " |"),
    );
    for (const failure of provider.failures) {
      lines.push(
        "",
        "#### " + failure.language + " / " + failure.target,
        "",
        "**Failure type:** " + failure.type,
        ...(failure.sdkModelName ? ["", "**SDK model:** " + code + failure.sdkModelName + code] : []),
        "",
        "**Summary:** " + summarizePsoMessage(failure.message),
      );
    }
  }
  lines.push("");
  return lines.join("\n");
}

function renderApiSummaryMarkdown(summary) {
  const operations = buildApiOperationRollup(summary.suites);
  const fence = String.fromCharCode(96).repeat(3);
  const code = String.fromCharCode(96);
  const lines = ["# API Compatibility Summary"];

  if (operations.length === 0) {
    lines.push("", "No API-operation failures were reported.", "");
    return lines.join("\n");
  }

  lines.push(
    "",
    fence + "echarts",
    JSON.stringify(buildApiFailureChart(operations), null, 2),
    fence,
  );
  for (const operation of operations) {
    const affectedTargets = summarizeProviderTargets(operation.failures);
    lines.push(
      "",
      "## " + code + operation.operationId + code,
      "",
      "**Failing outcomes:** " + operation.failureCount,
      "",
      "**SDK languages:** " + operation.languages.join(", "),
      "",
      "#### Affected targets",
      "",
      "| SDK language | SDK target | Failing outcomes |",
      "| --- | --- | ---: |",
      ...affectedTargets.map((target) => "| " + target.language + " | " + target.target + " | " + target.failureCount + " |"),
    );
    for (const failure of operation.failures) {
      lines.push(
        "",
        "#### " + failure.language + " / " + failure.target,
        "",
        "**Summary:** " + summarizePsoMessage(failure.message),
      );
    }
  }
  lines.push("");
  return lines.join("\n");
}

function summarizeProviderTargets(failures) {
  const targets = new Map();
  for (const failure of failures) {
    const key = failure.language + "\u0000" + failure.target;
    const target = targets.get(key) ?? { failureCount: 0, language: failure.language, target: failure.target };
    target.failureCount += 1;
    targets.set(key, target);
  }
  return [...targets.values()].sort((left, right) =>
    left.language.localeCompare(right.language) || left.target.localeCompare(right.target),
  );
}

function summarizePsoMessage(value) {
  const message = String(value ?? "").replace(/\s+/g, " ").trim();
  const summary = message.split(/\s+at\s+(?=[A-Z][A-Za-z0-9_.<])/)[0];
  return summary.length > 280 ? summary.slice(0, 277) + "…" : summary;
}

function renderPsoChartVariationsMarkdown(summary) {
  const providers = buildPsoProviderRollup(summary.suites);
  const fence = String.fromCharCode(96).repeat(3);
  const lines = [
    "# Provider Specific Output Summary — Chart Variations",
  ];
  for (const [index, providerGroup] of splitProvidersForCharts(providers).entries()) {
    const start = index * 20 + 1;
    const end = start + providerGroup.length - 1;
    lines.push(
      "",
      "## Failure count by provider — " + start + "–" + end,
      "",
      fence + "echarts",
      JSON.stringify(buildProviderRankingChart(providerGroup, {
        subtitle: "Failing language/SDK-target outcomes",
        title: "PSO failures by provider",
      }), null, 2),
      fence,
    );
  }
  for (const [index, providerGroup] of splitProvidersForCharts(providers).entries()) {
    const start = index * 20 + 1;
    const end = start + providerGroup.length - 1;
    lines.push(
      "",
      "## Failure type breakdown — " + start + "–" + end,
      "",
      fence + "echarts",
      JSON.stringify(buildPsoFailureTypeChart(providerGroup, { start, end }), null, 2),
      fence,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function splitProvidersForCharts(providers, groupSize = 20) {
  const groups = [];
  for (let index = 0; index < providers.length; index += groupSize) {
    groups.push(providers.slice(index, index + groupSize));
  }
  return groups;
}

function buildProviderRankingChart(providers, { subtitle, title }) {
  return {
    width: 1100,
    height: Math.max(880, providers.length * 42 + 180),
    title: {
      text: title,
      subtext: subtitle,
      left: 26,
      top: 18,
      textStyle: { color: "#1f2937", fontSize: 24 },
      subtextStyle: { color: "#676f7e", fontSize: 15 },
    },
    color: ["#d1242f"],
    grid: { left: 350, right: 100, top: 110, bottom: 44 },
    xAxis: {
      type: "value",
      minInterval: 1,
      axisLine: { lineStyle: { color: "#5b6b8c" } },
      axisLabel: { color: "#676f7e", fontSize: 14 },
      splitLine: { lineStyle: { color: "#5b6b8c" } },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: providers.map((provider) => provider.providerId),
      axisLine: { lineStyle: { color: "#5b6b8c" } },
      axisTick: { show: false },
      axisLabel: { color: "#1f2937", fontSize: 15, interval: 0 },
    },
    series: [{
      name: "Failing outcomes",
      type: "bar",
      barWidth: "62%",
      data: providers.map((provider) => provider.failureCount),
      label: { show: true, position: "right", color: "#1f2937", fontSize: 15, formatter: "{c}" },
    }],
  };
}

function buildPsoFailureTypeChart(providers, { start, end, subtitle, title = "Failure types by provider" }) {
  const failureTypes = [...new Set(providers.flatMap((provider) => provider.failures.map((failure) => failure.type)))].sort();
  return {
    width: 800,
    height: 1080,
    title: {
      text: title,
      subtext: subtitle ?? ("Providers " + start + "–" + end + "; each segment is a failing language/SDK-target outcome"),
      left: 26,
      top: 18,
      textStyle: { color: "#1f2937", fontSize: 26 },
      subtextStyle: { color: "#676f7e", fontSize: 16 },
    },
    color: ["#2b66c4", "#2f9e44", "#f3a33c", "#d1242f", "#7048e8", "#0f9b9b", "#c16f8a", "#7c5a3d"],
    legend: { bottom: 28, itemWidth: 15, itemHeight: 15, textStyle: { color: "#1f2937", fontSize: 15 } },
    grid: { left: 310, right: 42, top: 140, height: 780 },
    xAxis: {
      type: "value",
      minInterval: 1,
      axisLine: { lineStyle: { color: "#5b6b8c" } },
      axisLabel: { color: "#676f7e", fontSize: 16 },
      splitLine: { lineStyle: { color: "#5b6b8c" } },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: providers.map((provider) => provider.providerId),
      axisLine: { lineStyle: { color: "#5b6b8c" } },
      axisTick: { show: false },
      axisLabel: { color: "#1f2937", fontSize: providers.length > 25 ? 12 : 17, interval: 0 },
    },
    series: failureTypes.map((type) => ({
      name: type,
      type: "bar",
      stack: "outcomes",
      barWidth: "68%",
      data: providers.map((provider) => provider.failures.filter((failure) => failure.type === type).length),
    })),
  };
}

function buildPsoProviderRollup(suites) {
  const providers = new Map();
  for (const suite of suites) {
    for (const target of suite.targets) {
      for (const failure of target.providerOutputs.failed) {
        const provider = providers.get(failure.providerId) ?? {
          failureCount: 0, failures: [], languages: new Set(), providerId: failure.providerId,
          targets: new Set(), types: new Set(),
        };
        const type = classifyPsoFailure(failure.message).label;
        provider.failureCount += 1;
        provider.languages.add(suite.language);
        provider.targets.add(suite.language + "/" + targetLabel(target));
        provider.types.add(type);
        provider.failures.push({
          language: suite.language, message: failure.message, sdkModelName: failure.sdkModelName,
          target: targetLabel(target), type,
        });
        providers.set(failure.providerId, provider);
      }
    }
  }
  return [...providers.values()].map((provider) => ({
    ...provider,
    failureTypes: [...provider.types].sort(),
    languages: [...provider.languages].sort(),
    targets: [...provider.targets].sort(),
  })).sort((left, right) => right.failureCount - left.failureCount || left.providerId.localeCompare(right.providerId));
}

function buildApiOperationRollup(suites) {
  const operations = new Map();
  for (const suite of suites) {
    for (const target of suite.targets) {
      for (const failure of target.failures.filter((candidate) => candidate.id.startsWith("api."))) {
        const operation = operations.get(failure.id) ?? {
          failureCount: 0, failures: [], languages: new Set(), operationId: failure.id,
        };
        operation.failureCount += 1;
        operation.languages.add(suite.language);
        operation.failures.push({
          language: suite.language,
          message: failure.failure,
          target: targetLabel(target),
        });
        operations.set(failure.id, operation);
      }
    }
  }
  return [...operations.values()].map((operation) => ({
    ...operation,
    languages: [...operation.languages].sort(),
  })).sort((left, right) =>
    right.failureCount - left.failureCount || left.operationId.localeCompare(right.operationId));
}

function buildApiFailureChart(operations) {
  return {
    width: 1100,
    height: Math.max(1000, operations.length * 88 + 230),
    title: {
      text: "API Compatibility Summary",
      subtext: "Failing language/SDK-target outcomes by compatibility operation",
      left: 26,
      top: 18,
      textStyle: { color: "#1f2937", fontSize: 26 },
      subtextStyle: { color: "#676f7e", fontSize: 16 },
    },
    color: ["#d1242f"],
    grid: { left: 360, right: 100, top: 130, bottom: 72 },
    xAxis: {
      type: "value",
      minInterval: 1,
      axisLine: { lineStyle: { color: "#5b6b8c" } },
      axisLabel: { color: "#676f7e", fontSize: 18 },
      splitLine: { lineStyle: { color: "#5b6b8c" } },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: operations.map((operation) => operation.operationId),
      axisLine: { lineStyle: { color: "#5b6b8c" } },
      axisTick: { show: false },
      axisLabel: { color: "#1f2937", fontSize: 18, interval: 0 },
    },
    series: [{
      name: "Failing outcomes",
      type: "bar",
      barWidth: "54%",
      data: operations.map((operation) => operation.failureCount),
      label: { show: true, position: "right", color: "#1f2937", fontSize: 18, formatter: "{c}" },
    }],
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
  const lines = ["## API Coverage"];

  for (const { coverage, language } of summary.apiCoverages) {
    if (summary.apiCoverages.length > 1) {
      lines.push("", `### ${language}`);
    }
    const suite = summary.suites.find((candidate) => candidate.language === language);
    lines.push("", ...renderSingleApiCoverageLines(coverage, suite));
  }

  const providerOutputTargets = summary.suites.flatMap((suite) =>
    suite.targets
      .filter((target) => target.providerOutputs)
      .map((target) => ({ suite, target })),
  );
  if (providerOutputTargets.length > 0) {
    lines.push(
      "",
      "## PSO coverage",
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

function renderSingleApiCoverageLines(coverage, suite) {
  const coveredOperations = coverage.operations.filter((operation) => operation.covered);
  const uncoveredOperations = coverage.operations.filter((operation) => !operation.covered);
  const operationOutcomes = coverage.operations.map((operation) => ({
    operation,
    status: operationCoverageStatus(operation, suite),
  }));
  const passed = operationOutcomes.filter(({ status }) => status === "passed").length;
  const failed = operationOutcomes.filter(({ status }) => status === "failed").length;
  const untested = operationOutcomes.filter(({ status }) => status === "untested").length;
  const percentage = coverage.total === 0
    ? "0.0"
    : ((coverage.covered / coverage.total) * 100).toFixed(1);
  const lines = [
    "| Passed | Failed | Untested |",
    "| ---: | ---: | ---: |",
    `| ${passed} | ${failed} | ${untested} |`,
    "",
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

function operationCoverageStatus(operation, suite) {
  if (!operation.covered || !suite) return "untested";
  const statuses = suite.targets.flatMap((target) => target.outcomes)
    .filter((outcome) => operation.testCaseIds.includes(outcome.id))
    .map((outcome) => outcome.status);
  if (statuses.includes("failed")) return "failed";
  if (statuses.includes("passed")) return "passed";
  return "untested";
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
