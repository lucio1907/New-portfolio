import { HARNESS_SOURCE, WORKER_BOOTSTRAP } from "./harness";
import { type JsChallenge, MAX_CODE_LENGTH } from "./jsChallenges";

export type TestResult = { id: string; passed: boolean; message?: string };

export type SandboxResult = {
  status: "passed" | "failed" | "error" | "timeout";
  message?: string;
  results: TestResult[];
};

const WORKER_SOURCE = `${HARNESS_SOURCE}\n${WORKER_BOOTSTRAP}`;
const RUN_TIMEOUT_MS = 3000;

/**
 * Runs the visitor's code against the challenge tests inside a throwaway Web
 * Worker. The worker is always terminated, so infinite loops cannot freeze the
 * page and nothing survives between runs.
 */
export const runInSandbox = (
  challenge: JsChallenge,
  code: string,
): Promise<SandboxResult> => {
  if (code.length > MAX_CODE_LENGTH) {
    return Promise.resolve({
      status: "error",
      message: `code is longer than ${MAX_CODE_LENGTH} characters`,
      results: [],
    });
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(
      new Blob([WORKER_SOURCE], { type: "text/javascript" }),
    );
    const worker = new Worker(url);
    let settled = false;

    const finish = (result: SandboxResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };

    const timer = setTimeout(
      () => finish({ status: "timeout", results: [] }),
      RUN_TIMEOUT_MS,
    );

    worker.onmessage = (event: MessageEvent<SandboxResult>) => finish(event.data);
    worker.onerror = (event) => {
      event.preventDefault();
      finish({ status: "error", message: event.message, results: [] });
    };

    worker.postMessage({
      code,
      entry: challenge.entry,
      tests: challenge.tests,
    });
  });
};
