import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    PARADYM_API_KEY: z.string().min(1),
    PARADYM_CREDENTIAL_TEMPLATE_ID: z.string().min(1),
    PARADYM_PRESENTATION_TEMPLATE_ID: z.string().min(1),
    PARADYM_PROJECT_ID: z.string().min(1)
  },
  client: {},
  experimental__runtimeEnv: {},
});
