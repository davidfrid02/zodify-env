import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number(),
  DEBUG: z.coerce.boolean(),
  API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
