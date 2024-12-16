import z from 'zod';
process.loadEnvFile();

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

const envParsed = envSchema.safeParse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});

if (!envParsed.success) {
  console.log(envParsed.error);
  throw new Error('Env variables are not valid');
}

export const env = envParsed.data;
