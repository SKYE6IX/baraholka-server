import TelegramBot from "packages/TelegramBot";
import GPTClient from "packages/GPTClient";
import S3 from "packages/S3";
import { createNewUser, isUserExist } from "./userServices";
import { createNewAd } from "./adService";
import { User } from "types/user";
import { BaseAd } from "types/ad";
import { NewMessageData, ResolveParseData } from "types/parseData";

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

async function getNormalizedData(message: string) {
    try {
        const response = await gptClient.parseMessage(message);
        if (response) {
            const ads = JSON.parse(response) as ResolveParseData;
            return ads;
        }
    } catch (error) {
        console.log("Unable to parse the message: \n" + error);
    }
}

async function getMediaUrl(data: NewMessageData, title: string) {
    const tempArray: string[] = [];
    if (data.photo) {
        const url = (await S3.uploadSingleImage(data.photo, title)) as string;
        tempArray.push(url);
        return tempArray;
    } else if (data.photos) {
        const urlList = (await S3.uploadMultipleImage(data.photos, title)) as string[];
        return urlList;
    }
}

export async function parseData() {
    try {
        telegramBot.runNewMessageEvent(async (messageData) => {
            const userData = messageData.user as User;
            const adsData = await getNormalizedData(messageData.message);
            if (adsData) {
                let user: User;
                const existingUser = await isUserExist(userData);
                if (existingUser) {
                    user = existingUser;
                } else {
                    user = (await createNewUser(userData)) as User;
                }
                const mediaUrl = await getMediaUrl(messageData, adsData.title);
                const newAd: BaseAd = {
                    userId: user.id,
                    title: adsData.title,
                    description: adsData.description,
                    price: adsData.price,
                    currency: adsData.currency,
                    source: "TELEGRAM_AD",
                    location: {
                        country: "Georgia",
                        city: "Tbilisi",
                        location: adsData.location,
                    },
                };
                if (mediaUrl) {
                    await createNewAd(newAd, mediaUrl);
                }
            }
        });
    } catch (error) {
        console.log("Unable to run new Message event: \n" + error);
    }
}
