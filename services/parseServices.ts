import TelegramBot from "packages/TelegramBot";
import GPTClient from "packages/GPTClient";
import S3 from "packages/S3";
import { createNewUser, isUserExist } from "./userServices";
import { createNewAd } from "./adService";
import { User } from "types/user";
import { BaseAd } from "types/ad";
import { NewMessageData, ResolveParseData } from "types/parseData";
import handleError from "./handleError";

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
        handleError(error);
    }
}

async function getMediaUrl(data: NewMessageData, title: string) {
    try {
        const tempArray: string[] = [];
        if (data.photo) {
            const url = (await S3.uploadSingleImage(data.photo, title)) as string;
            tempArray.push(url);
            return tempArray;
        } else if (data.photos) {
            const urlList = (await S3.uploadMultipleImage(
                data.photos,
                title
            )) as string[];
            return urlList;
        }
    } catch (error) {
        handleError(error);
    }
}

async function removeMedia(urls: string[], title: string) {
    try {
        const pattern = new RegExp(/[\s\p{P}]+/gu);
        const convertTitle = title.replace(pattern, "_").toLowerCase();
        if (urls.length > 1) {
            const keys = urls.sort().map((url, i) => {
                const startIndex = url.indexOf(convertTitle + "_" + (i + 1));
                const key = url.substring(startIndex, url.length);
                return key;
            });
            await S3.deleteMultipleImage(keys);
        } else if (urls.length <= 1) {
            const singleUrl = urls[0];
            const startIndex = singleUrl.indexOf(convertTitle);
            const key = singleUrl.substring(startIndex, singleUrl.length);
            await S3.deleteSingleImage(key);
        }
    } catch (error) {
        handleError(error);
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
                    const response = await createNewAd(newAd, mediaUrl);
                    if (!response) {
                        removeMedia(mediaUrl, newAd.title);
                    }
                }
            }
        });
    } catch (error) {
        handleError(error);
    }
}
