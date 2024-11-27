// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requiredServerEnvs = [
    "NODE_ENV",
    "OPEN_AI_KEY",
    "OPEN_AI_PROJECT_ID",
    "OPEN_AI_ORG_ID",
    "TELEGRAM_API_ID",
    "TELEGRAM_API_HASH",
    "TELEGRAM_SESSIONS_ID",
    "DATABASE_URL",
    "DIRECT_URL",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "AWS_BUCKET",
] as const;
type RequiredServerEnvKeys = (typeof requiredServerEnvs)[number];

declare global {
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
    }
}
export {};
