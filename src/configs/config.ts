import z from 'zod';
process.loadEnvFile();

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  CURRENCY_API_URL: z.string().url(),
  CURRENCY_API_KEY: z.string(),
});

const envParsed = envSchema.safeParse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CURRENCY_API_URL: process.env.CURRENCY_API_URL,
  CURRENCY_API_KEY: process.env.CURRENCY_API_KEY,
});

if (!envParsed.success) {
  console.log(envParsed.error);
  throw new Error('Env variables are not valid');
}

export const env = envParsed.data;
