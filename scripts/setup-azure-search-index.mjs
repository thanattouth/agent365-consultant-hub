const endpoint = getRequiredEnv("AZURE_AI_SEARCH_ENDPOINT").replace(/\/$/, "");
const indexName = getRequiredEnv("AZURE_AI_SEARCH_INDEX");
const apiKey = getRequiredEnv("AZURE_AI_SEARCH_API_KEY");
const apiVersion = process.env.AZURE_AI_SEARCH_API_VERSION ?? "2024-07-01";

const fields = [
  {
    name: "id",
    type: "Edm.String",
    key: true,
    searchable: false,
    filterable: true,
    retrievable: true,
    sortable: false,
    facetable: false,
  },
  textField("title", { filterable: false }),
  textField("source", { searchable: false, filterable: true, facetable: true }),
  textField("url", { searchable: false, filterable: false }),
  textField("product", { filterable: true, facetable: true }),
  textField("scenario", { filterable: true, facetable: true }),
  textField("sensitivity", { searchable: false, filterable: true, facetable: true }),
  collectionField("modes", { searchable: false, filterable: true }),
  collectionField("keywords", { searchable: true, filterable: false }),
  textField("content", { filterable: false }),
];

const indexDefinition = {
  name: indexName,
  fields,
  semantic: {
    configurations: [
      {
        name: "agent365-semantic",
        prioritizedFields: {
          titleField: {
            fieldName: "title",
          },
          prioritizedContentFields: [
            {
              fieldName: "content",
            },
          ],
          prioritizedKeywordsFields: [
            {
              fieldName: "keywords",
            },
          ],
        },
      },
    ],
  },
};

const indexUrl = `${endpoint}/indexes('${encodeURIComponent(indexName)}')?api-version=${encodeURIComponent(
  apiVersion,
)}`;

let response;

try {
  response = await fetch(indexUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      Prefer: "return=representation",
    },
    body: JSON.stringify(indexDefinition),
  });
} catch {
  console.log("Azure AI Search index setup request could not be completed.");
  process.exit(1);
}

const payload = await response.json().catch(() => ({}));

if (!response.ok) {
  console.log(`Azure AI Search index setup failed with HTTP ${response.status}.`);
  if (payload.error?.message) {
    console.log(payload.error.message);
  }
  process.exit(1);
}

console.log(`Azure AI Search index ${indexName} is ready.`);
console.log(`  fields: ${payload.fields?.length ?? fields.length}`);
console.log(`  semanticConfigurations: ${payload.semantic?.configurations?.length ?? 0}`);

function textField(
  name,
  {
    searchable = true,
    filterable = false,
    facetable = false,
  } = {},
) {
  return {
    name,
    type: "Edm.String",
    searchable,
    filterable,
    retrievable: true,
    sortable: false,
    facetable,
  };
}

function collectionField(
  name,
  {
    searchable,
    filterable,
  },
) {
  return {
    name,
    type: "Collection(Edm.String)",
    searchable,
    filterable,
    retrievable: true,
    sortable: false,
    facetable: filterable,
  };
}

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    console.log(`Missing required environment variable: ${name}`);
    process.exit(1);
  }

  return value;
}
