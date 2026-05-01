import 'server-only'
import { Paradym } from "@paradym/sdk";
import { env } from '@/env';

export const paradym = new Paradym({
  apiKey: env.PARADYM_API_KEY,
});