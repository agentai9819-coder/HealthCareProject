import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    API_PREFIX: z.string().default("/api/v1"),
    DATABASE_URL: z.string().url(),
    BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    SESSION_SECRET: z.string().min(32),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === "production") {
        const insecurePlaceholders = [
          "a_very_secure_long_secret_key_minimum_32_characters_long_for_sessions",
          "default_session_secret_replace_in_production",
          "changeme_changeme_changeme_changeme_32",
        ];
        return !insecurePlaceholders.includes(data.SESSION_SECRET);
      }
      return true;
    },
    {
      message:
        "SESSION_SECRET must not use insecure default/example placeholders in production environment",
      path: ["SESSION_SECRET"],
    }
  );

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    process.exit(1);
  }

  return result.data;
};

export const env = validateEnv();