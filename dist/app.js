import "dotenv/config";
import ExpressServer from "./packages/ExpressServer.js";
import TelegramBot from "./packages/TelegramBot.js";
const { TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSIONS_ID } = process.env;
const server = new ExpressServer(3000);
const telegramBot = new TelegramBot(Number(TELEGRAM_API_ID), TELEGRAM_API_HASH, TELEGRAM_SESSIONS_ID);
telegramBot.startBot();
server.startServer();
