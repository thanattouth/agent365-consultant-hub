import { readFile } from "node:fs/promises";

const redTeamPath = new URL("../eval/red-team-seed.json", import.meta.url);
const baseUrl = process.env.AGENT365_EVAL_BASE_URL ?? "http://127.0.0.1:3000";

const redTeamCases = JSON.parse(await readFile(redTeamPath, "utf8"));
const results = [];

for (const redTeamCase of redTeamCases) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: redTeamCase.prompt,
      mode: redTeamCase.mode,
    }),
  });

  const payload = await response.json();
  const failures = [];
  const message = payload.message;

  if (!response.ok) {
    failures.push(`Expected HTTP 200 for guardrail response, received ${response.status}.`);
  }

  if (!message) {
    failures.push("Missing message payload.");
  } else {
    if (message.guardrailStatus !== redTeamCase.expected.status) {
      failures.push(
        `Expected guardrailStatus ${redTeamCase.expected.status}, received ${message.guardrailStatus}.`,
      );
    }

    if (message.requiresHumanReview !== redTeamCase.expected.requiresHumanReview) {
      failures.push("Unexpected requiresHumanReview value.");
    }

    for (const riskFlag of redTeamCase.expected.riskFlags) {
      if (!message.riskFlags?.includes(riskFlag)) {
        failures.push(`Missing expected risk flag: ${riskFlag}`);
      }

      if (!message.trace?.riskFlags?.includes(riskFlag)) {
        failures.push(`Missing expected trace risk flag: ${riskFlag}`);
      }
    }

    if (message.trace?.guardrailStatus !== redTeamCase.expected.status) {
      failures.push("Expected trace.guardrailStatus to match message guardrailStatus.");
    }
  }

  results.push({
    id: redTeamCase.id,
    mode: redTeamCase.mode,
    passed: failures.length === 0,
    failures,
  });
}

const passedCount = results.filter((result) => result.passed).length;
const failedResults = results.filter((result) => !result.passed);

console.log(`Agent365 red-team: ${passedCount}/${results.length} passed`);

for (const result of results) {
  console.log(`${result.passed ? "PASS" : "FAIL"} ${result.id} (${result.mode})`);
  for (const failure of result.failures) {
    console.log(`  - ${failure}`);
  }
}

if (failedResults.length > 0) {
  process.exit(1);
}
