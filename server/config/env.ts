import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DEEPSEEK_API_KEY: z.string().trim().min(1),
  DEEPSEEK_BASE_URL: z.string().url().default('https://api.deepseek.com'),
  DEEPSEEK_MODEL: z.string().trim().default('deepseek-v4-flash'),
});

export interface AppConfig {
  port: number;
  deepSeek: {
    apiKey: string;
    baseUrl: string;
    model: string;
    timeoutMs: number;
  };
}

export function loadConfig(environment = process.env): AppConfig {
  const parsed = envSchema.parse(environment);
  return {
    port: parsed.PORT,
    deepSeek: {
      apiKey: parsed.DEEPSEEK_API_KEY,
      baseUrl: parsed.DEEPSEEK_BASE_URL.replace(/\/$/, ''),
      model: parsed.DEEPSEEK_MODEL,
      timeoutMs: 30_000,
    },
  };
}
