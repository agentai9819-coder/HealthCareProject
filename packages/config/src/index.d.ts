import { z } from "zod";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    API_PREFIX: z.ZodDefault<z.ZodString>;
    DATABASE_URL: z.ZodString;
    BCRYPT_SALT_ROUNDS: z.ZodDefault<z.ZodNumber>;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
    SESSION_SECRET: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    API_PREFIX: string;
    DATABASE_URL: string;
    BCRYPT_SALT_ROUNDS: number;
    CORS_ORIGIN: string;
    SESSION_SECRET: string;
}, {
    DATABASE_URL: string;
    SESSION_SECRET: string;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    API_PREFIX?: string | undefined;
    BCRYPT_SALT_ROUNDS?: number | undefined;
    CORS_ORIGIN?: string | undefined;
}>;
export type EnvConfig = z.infer<typeof envSchema>;
export declare const validateEnv: () => EnvConfig;
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    API_PREFIX: string;
    DATABASE_URL: string;
    BCRYPT_SALT_ROUNDS: number;
    CORS_ORIGIN: string;
    SESSION_SECRET: string;
};
export {};
//# sourceMappingURL=index.d.ts.map