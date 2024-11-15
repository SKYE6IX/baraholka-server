const requiredServerEnvs = [
    "OPEN_AI_KEY",
    "OPEN_AI_PROJECT_ID",
    "OPEN_AI_ORG_ID",
    "TELEGRAM_API_ID",
    "TELEGRAM_API_HASH",
    "TELEGRAM_SESSIONS_ID",
] as const;
type RequiredServerEnvKeys = (typeof requiredServerEnvs)[number];

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
    }
}
export {};
