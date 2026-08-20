"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.validateEnv = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(3000),
    API_PREFIX: zod_1.z.string().default("/api/v1"),
    DATABASE_URL: zod_1.z.string().url(),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().default(10),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:3000"),
    SESSION_SECRET: zod_1.z.string().min(32),
});
const validateEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error("❌ Invalid environment variables:", result.error.format());
        process.exit(1);
    }
    return result.data;
};
exports.validateEnv = validateEnv;
exports.env = (0, exports.validateEnv)();
