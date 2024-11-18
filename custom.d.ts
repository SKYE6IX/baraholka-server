// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requiredServerEnvs = [
    "OPEN_AI_KEY",
    "OPEN_AI_PROJECT_ID",
    "OPEN_AI_ORG_ID",
    "TELEGRAM_API_ID",
    "TELEGRAM_API_HASH",
    "TELEGRAM_SESSIONS_ID",
    "DATABASE_URL",
    "DIRECT_URL",
] as const;
type RequiredServerEnvKeys = (typeof requiredServerEnvs)[number];

declare global {
    namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
    }
}
export {};
