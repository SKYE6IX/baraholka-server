import "dotenv/config";
import ExpressServer from "./packages/ExpressServer";
import TelegramBot from "./packages/TelegramBot";
import GPTClient from "packages/GPTClient";

const {
    TELEGRAM_API_ID,
    TELEGRAM_API_HASH,
    TELEGRAM_SESSIONS_ID,
    OPEN_AI_KEY,
    OPEN_AI_ORG_ID,
    OPEN_AI_PROJECT_ID,
} = process.env;
const server = new ExpressServer(3000);

const telegramBot = new TelegramBot(
    Number(TELEGRAM_API_ID),
    TELEGRAM_API_HASH,
    TELEGRAM_SESSIONS_ID
);

const gptClient = new GPTClient(OPEN_AI_KEY, OPEN_AI_ORG_ID, OPEN_AI_PROJECT_ID);

// telegramBot.startBot();
// telegramBot.getAdsContent();
server.startServer();
