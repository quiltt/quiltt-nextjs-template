import path from "node:path";

import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

// Load credentials from `.env.local` so codegen can introspect the schema.
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      "https://api.quiltt.io/v1/graphql": {
        headers: {
          Authorization: `Bearer ${process.env.QUILTT_API_KEY_SECRET}`,
        },
      },
    },
  ],
  // GraphQL operations to generate types for.
  documents: ["src/**/*.graphql"],
  generates: {
    // Generated output lives in src/gql (git-ignored). Regenerate with:
    //   pnpm graphql:generate   (or `pnpm graphql:watch`)
    "src/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        // Emit `import type` so generated files stay compatible with
        // `verbatimModuleSyntax` (enabled in tsconfig.json).
        useTypeImports: true,
      },
    },
  },
};

export default config;
