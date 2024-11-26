import TelegramBot from "packages/TelegramBot";
import GPTClient from "packages/GPTClient";
import S3 from "packages/S3";
import { createNewUser, isUserExist } from "./userServices";
import { createNewAd } from "./adService";
import { BaseUser, User } from "types/user";
import { BaseAd } from "types/ad";

const {
    TELEGRAM_API_ID,
    TELEGRAM_API_HASH,
    TELEGRAM_SESSIONS_ID,
    OPEN_AI_KEY,
    OPEN_AI_ORG_ID,
    OPEN_AI_PROJECT_ID,
} = process.env;

const telegramBot = new TelegramBot(
    Number(TELEGRAM_API_ID),
    TELEGRAM_API_HASH,
    TELEGRAM_SESSIONS_ID
);
const gptClient = new GPTClient(OPEN_AI_KEY, OPEN_AI_ORG_ID, OPEN_AI_PROJECT_ID);

export function startBot() {
    telegramBot.startBot();
}

export async function parseData() {
    telegramBot.runNewMessageEvent(async (messageData) => {
        let user: User;
        const userData = messageData.user as BaseUser;
        const adData = await gptClient.parseMessage(messageData.message);
        const existingUser = await isUserExist(userData);
        if (existingUser) {
            user = existingUser;
        } else {
            user = createNewUser(userData);
        }
        if (adData) {
            const adObject: BaseAd = {
                title: adData.title,
                description: adData.description,
                price: adData.price,
                currency: "GEL",
                source: "TELEGRAM_AD",
                location: "",
            };
            if (messageData.photo) {
                const url = (await S3.uploadSingleImage(
                    messageData.photo,
                    adData.title
                )) as string;
                const ad = await createNewAd(user.id, adObject, url);
                console.log(ad);
            } else if (messageData.photos) {
                const urlList = await S3.uploadMultipleImage(
                    messageData.photos,
                    adData.title
                );
                console.log(urlList);
            }
        }
    });
}
