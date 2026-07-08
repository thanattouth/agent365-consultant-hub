const baseUrl = process.env.AGENT365_EVAL_BASE_URL ?? "http://127.0.0.1:3000";

const smokeCase = {
  id: "azure-rag-smoke-001",
  mode: "architect",
  prompt:
    "Design the first production RAG MVP for a Microsoft 365 consultant chatbot using Microsoft Learn citations.",
  expectedCitationTitles: ["Azure AI Search for RAG"],
};

const response = await fetch(`${baseUrl}/api/chat`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: smokeCase.prompt,
    mode: smokeCase.mode,
  }),
});

const payload = await response.json().catch(() => ({}));
const failures = [];
const message = payload.message;

if (!response.ok) {
  failures.push(`Expected HTTP 200, received ${response.status}.`);
}

if (!message) {
  failures.push("Missing message payload.");
} else {
  if (message.provider !== "azure-openai") {
    failures.push(`Expected provider azure-openai, received ${message.provider}.`);
  }

  if (message.mode !== smokeCase.mode) {
    failures.push(`Expected mode ${smokeCase.mode}, received ${message.mode}.`);
  }

  if (message.requiresCitation !== true) {
    failures.push("Expected requiresCitation to be true.");
  }

  if (!Array.isArray(message.citations) || message.citations.length === 0) {
    failures.push("Expected at least one citation.");
  }

  if (!Array.isArray(message.followUpQuestions) || message.followUpQuestions.length === 0) {
    failures.push("Expected at least one follow-up question.");
  }

  if (!message.trace) {
    failures.push("Expected trace metadata.");
  } else {
    if (message.trace.requestId !== payload.requestId) {
      failures.push("Expected trace.requestId to match response requestId.");
    }

    if (message.trace.provider !== "azure-openai") {
      failures.push(`Expected trace.provider azure-openai, received ${message.trace.provider}.`);
    }

    if (message.trace.retrievalResultCount < 1) {
      failures.push("Expected at least one retrieval result in trace.");
    }

    if (message.trace.citationCount !== message.citations?.length) {
      failures.push("Expected trace.citationCount to match citations length.");
    }

    if (!Array.isArray(message.trace.retrieval) || message.trace.retrieval.length === 0) {
      failures.push("Expected retrieval trace items.");
    }
  }

  const citationTitles = Array.isArray(message.citations)
    ? message.citations.map((citation) => String(citation.title ?? "").toLowerCase())
    : [];

  for (const title of smokeCase.expectedCitationTitles) {
    if (!citationTitles.includes(title.toLowerCase())) {
      failures.push(`Missing expected citation: ${title}.`);
    }
  }

  const serializedPayload = JSON.stringify(payload).toLowerCase();
  for (const sensitiveToken of ["api-key", "azure_openai_api_key"]) {
    if (serializedPayload.includes(sensitiveToken)) {
      failures.push(`Response payload appears to include sensitive token marker: ${sensitiveToken}.`);
    }
  }
}

if (failures.length > 0) {
  console.log(`Agent365 Azure smoke: FAIL ${smokeCase.id}`);
  for (const failure of failures) {
    console.log(`  - ${failure}`);
  }
  if (payload.requestId) {
    console.log(`  requestId: ${payload.requestId}`);
  }
  process.exit(1);
}

console.log(`Agent365 Azure smoke: PASS ${smokeCase.id}`);
console.log(`  requestId: ${payload.requestId}`);
console.log(`  citations: ${message.citations.length}`);
console.log(`  retrievalResults: ${message.trace.retrievalResultCount}`);
