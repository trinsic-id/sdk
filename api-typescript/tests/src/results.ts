import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface CompatibilityCaseResult {
  advisory?: {
    code: string;
    message: string;
  };
  durationMs: number;
  failure?: {
    message: string;
    name: string;
  };
  id: string;
  parameters?: Record<string, string>;
  skipReason?: string;
  status: "passed" | "failed" | "skipped";
}

interface TestFileResult {
  schemaVersion: 1;
  testCases: CompatibilityCaseResult[];
}

const resultPath = process.env.SDK_COMPATIBILITY_RESULT_FILE;
const testCases: CompatibilityCaseResult[] = [];

export async function recordCompatibilityCase<T>(
  id: string,
  action: () => Promise<T>,
  parameters?: Record<string, string>,
): Promise<T> {
  const startedAt = performance.now();

  try {
    const result = await action();
    testCases.push({
      durationMs: elapsedMilliseconds(startedAt),
      id,
      parameters,
      status: "passed",
    });
    return result;
  } catch (error) {
    testCases.push({
      durationMs: elapsedMilliseconds(startedAt),
      failure: failureDetails(error),
      id,
      parameters,
      status: "failed",
    });
    throw error;
  }
}

export function recordSkippedCompatibilityCase(
  id: string,
  skipReason: string,
  parameters?: Record<string, string>,
  advisory?: CompatibilityCaseResult["advisory"],
): void {
  testCases.push({
    ...(advisory ? { advisory } : {}),
    durationMs: 0,
    id,
    parameters,
    skipReason,
    status: "skipped",
  });
}

process.once("exit", () => {
  if (!resultPath) {
    return;
  }

  const result: TestFileResult = {
    schemaVersion: 1,
    testCases,
  };
  mkdirSync(dirname(resultPath), { recursive: true });
  writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`);
});

function elapsedMilliseconds(startedAt: number): number {
  return Math.round((performance.now() - startedAt) * 1000) / 1000;
}

function failureDetails(error: unknown): { message: string; name: string } {
  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }

  return { message: String(error), name: "Error" };
}
