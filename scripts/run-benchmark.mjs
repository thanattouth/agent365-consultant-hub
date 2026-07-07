import { readFile } from "node:fs/promises";

const benchmarkPath = new URL("../eval/benchmark-seed.json", import.meta.url);
const baseUrl = process.env.AGENT365_EVAL_BASE_URL ?? "http://127.0.0.1:3000";
const contractVersion = "chat.response.v1";

const benchmarkCases = JSON.parse(await readFile(benchmarkPath, "utf8"));

const results = [];

for (const benchmarkCase of benchmarkCases) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: benchmarkCase.prompt,
      mode: benchmarkCase.mode,
    }),
  });

  const payload = await response.json();
  const failures = [];

  if (!response.ok) {
    failures.push(`Expected HTTP 200, received ${response.status}.`);
  }

  const message = payload.message;

  if (!message) {
    failures.push("Missing message payload.");
  } else {
    if (message.contractVersion !== contractVersion) {
      failures.push(`Expected contractVersion ${contractVersion}.`);
    }

    if (message.provider !== "local") {
      failures.push(`Expected local provider, received ${message.provider}.`);
    }

    if (message.mode !== benchmarkCase.mode) {
      failures.push(`Expected mode ${benchmarkCase.mode}, received ${message.mode}.`);
    }

    if (typeof message.confidence !== "number" || message.confidence < 0 || message.confidence > 1) {
      failures.push("Expected confidence between 0 and 1.");
    }

    if (message.requiresCitation !== true) {
      failures.push("Expected requiresCitation to be true.");
    }

    if (!["standard", "sensitive", "high"].includes(message.safetyLevel)) {
      failures.push("Expected safetyLevel to be standard, sensitive, or high.");
    }

    if (!Array.isArray(message.citations) || message.citations.length === 0) {
      failures.push("Expected at least one citation.");
    }

    const citationTitles = Array.isArray(message.citations)
      ? message.citations.map((citation) => String(citation.title ?? "").toLowerCase())
      : [];

    for (const title of benchmarkCase.assertions.expectedCitationTitles ?? []) {
      if (!citationTitles.includes(title.toLowerCase())) {
        failures.push(`Missing expected citation: ${title}`);
      }
    }

    if (!Array.isArray(message.followUpQuestions) || message.followUpQuestions.length === 0) {
      failures.push("Expected at least one follow-up question.");
    }

    const content = String(message.content ?? "").toLowerCase();
    for (const phrase of benchmarkCase.assertions.mustContain) {
      if (!content.includes(phrase.toLowerCase())) {
        failures.push(`Missing expected phrase: ${phrase}`);
      }
    }
  }

  results.push({
    id: benchmarkCase.id,
    mode: benchmarkCase.mode,
    passed: failures.length === 0,
    failures,
  });
}

const passedCount = results.filter((result) => result.passed).length;
const failedResults = results.filter((result) => !result.passed);

console.log(`Agent365 benchmark: ${passedCount}/${results.length} passed`);

for (const result of results) {
  console.log(`${result.passed ? "PASS" : "FAIL"} ${result.id} (${result.mode})`);
  for (const failure of result.failures) {
    console.log(`  - ${failure}`);
  }
}

if (failedResults.length > 0) {
  process.exit(1);
}
