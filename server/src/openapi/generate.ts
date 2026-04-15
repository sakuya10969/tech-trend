import { writeFile } from "node:fs/promises";
import app from "../index";
import { openApiDocument } from "./doc";

const outputPath = new URL("../openapi.json", import.meta.url);

const document = app.getOpenAPI31Document(openApiDocument, {
  unionPreferredType: "oneOf",
});

await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`);

console.log(`OpenAPI document generated at ${outputPath.pathname}`);
