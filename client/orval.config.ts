import { defineConfig } from "orval";

export default defineConfig({
  techTrend: {
    input: "../server/src/openapi.json",
    output: {
      target: "src/shared/api/generated/github-trending/github-trending.ts",
      schemas: "src/shared/api/generated/model",
      client: "react-query",
      mode: "split",
      httpClient: "axios",
      override: {
        query: {
          useQuery: true,
        },
      },
    },
  },
});
