import TelegramBot from "../packages/TelegramBot.js";
import GPTClient from "../packages/GPTClient.js";
import S3 from "../packages/S3.js";
import { createNewUser, isUserExist } from "./userServices.js";
import { createNewAd } from "./adService.js";
import handleError from "./handleError.js";
const { TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSIONS_ID, OPEN_AI_KEY, OPEN_AI_ORG_ID, OPEN_AI_PROJECT_ID, } = process.env;
const telegramBot = new TelegramBot(Number(TELEGRAM_API_ID), TELEGRAM_API_HASH, TELEGRAM_SESSIONS_ID);
const gptClient = new GPTClient(OPEN_AI_KEY, OPEN_AI_ORG_ID, OPEN_AI_PROJECT_ID);
export function startBot() {
    telegramBot.startBot();
}
async function getNormalizedData(message) {
    try {
        const response = await gptClient.parseMessage(message);
        if (response) {
            const ads = JSON.parse(response);
            return ads;
        }
    }
    catch (error) {
        handleError(error);
    }
}
async function getMediaUrl(data, title) {
    try {
        const tempArray = [];
        if (data.photo) {
            const url = (await S3.uploadSingleImage(data.photo, title));
            tempArray.push(url);
            return tempArray;
        }
        else if (data.photos) {
            const urlList = (await S3.uploadMultipleImage(data.photos, title));
            return urlList;
        }
    }
    catch (error) {
        handleError(error);
    }
}
async function removeMedia(urls, title) {
    try {
        const pattern = new RegExp(/[\s\p{P}]+/gu);
        const convertTitle = title.replace(pattern, "_").toLowerCase();
        if (urls.length > 1) {
            const keys = urls.map((url) => {
                let prefixIdx = 1;
                const startIndex = url.indexOf(convertTitle + "_" + prefixIdx++);
                const key = url.substring(startIndex, url.length);
                return key;
            });
            await S3.deleteMultipleImage(keys);
        }
        else if (urls.length <= 1) {
            const singleUrl = urls[0];
            const startIndex = singleUrl.indexOf(convertTitle);
            const key = singleUrl.substring(startIndex, singleUrl.length);
            await S3.deleteSingleImage(key);
        }
    }
    catch (error) {
        handleError(error);
    }
}
export async function parseData() {
    try {
        telegramBot.runNewMessageEvent(async (messageData) => {
            const userData = messageData.user;
            const adsData = await getNormalizedData(messageData.message);
            if (adsData) {
                let user;
                const existingUser = await isUserExist(userData);
                if (existingUser) {
                    user = existingUser;
                }
                else {
                    user = (await createNewUser(userData));
                }
                const mediaUrl = await getMediaUrl(messageData, adsData.title);
                const newAd = {
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
                }
            }
        });
    }
    catch (error) {
        handleError(error);
    }
}
