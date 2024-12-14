import OpenAI from "openai";
import { S3ServiceException } from "@aws-sdk/client-s3";
import TelegramBot from "../packages/TelegramBot.js";
import GPTClient from "../packages/GPTClient.js";
import S3 from "../packages/S3.js";
import { createNewUser, isUserExist } from "./userServices.js";
import { createNewAd } from "./adService.js";
import Logger from "../packages/Logger.js";
import { sentryInfo, sentryError, sentrySuccessLog } from "./sentryHandlers.js";
const { TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSIONS_ID, OPEN_AI_KEY, OPEN_AI_ORG_ID, OPEN_AI_PROJECT_ID, } = process.env;
const telegramBot = new TelegramBot(Number(TELEGRAM_API_ID), TELEGRAM_API_HASH, TELEGRAM_SESSIONS_ID);
const gptClient = new GPTClient(OPEN_AI_KEY, OPEN_AI_ORG_ID, OPEN_AI_PROJECT_ID);
const logger = new Logger({ service: "PARSE DATA SERVICE" });
export function startBot() {
    telegramBot.startBot();
}
export async function getNormalizedData(message) {
    try {
        const response = await gptClient.parseMessage(message);
        if (response) {
            const ads = JSON.parse(response);
            logger.infoLogging({
                message: "[Successfully Normalized!]\n",
            });
            sentryInfo({ message: "[Successfully Normalized!]" });
            return ads;
        }
        else {
            return;
        }
    }
    catch (error) {
        if (error instanceof OpenAI.APIError) {
            const message = `[Failed To Normalized]\n ${error.message}\n`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        }
        else {
            console.error("[Failed To Normalized]: Unknown error occur: " + error);
        }
    }
}
async function getMediaUrl(data, title) {
    try {
        const tempArray = [];
        if (data.photo) {
            const url = (await S3.uploadSingleImage(data.photo, title));
            tempArray.push(url);
            logger.infoLogging({
                message: "[Successfully get media url!]\n",
            });
            sentryInfo({ message: "[Successfully get media url!]" });
            return tempArray;
        }
        else if (data.photos) {
            const urlList = (await S3.uploadMultipleImage(data.photos, title));
            logger.infoLogging({
                message: "[Successfully get media urls!]\n",
            });
            sentryInfo({ message: "[Successfully get media url!]" });
            return urlList;
        }
    }
    catch (error) {
        if (error instanceof S3ServiceException) {
            const message = `[Failed To GetURL] \n[Name]: ${error.name} \n[Message]: ${error.message}`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        }
        else {
            console.error("[Failed To GetURL]: Unknown error occur: " + error);
        }
    }
}
async function removeMedia(urls, title) {
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
        }
        else if (urls.length <= 1) {
            const singleUrl = urls[0];
            const startIndex = singleUrl.indexOf(convertTitle);
            const key = singleUrl.substring(startIndex, singleUrl.length);
            await S3.deleteSingleImage(key);
        }
    }
    catch (error) {
        if (error instanceof S3ServiceException) {
            const message = `[Failed To Remove Media] \n[Name]: ${error.name} \n[Message]: ${error.message}`;
            logger.errorLogging({
                message: message,
            });
        }
        else {
            console.error("[Failed To Remove Media]: Unknown error occur: " + error);
        }
    }
}
export async function parseData() {
    try {
        telegramBot.runNewMessageEvent(async (messageData) => {
            logger.infoLogging({
                message: "[Starting parse data...]\n",
            });
            sentryInfo({ message: "[Starting parse data...]" });
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
                    if (!response) {
                        removeMedia(mediaUrl, newAd.title);
                    }
                    else {
                        const message = "Message parse: " +
                            messageData.message +
                            " -> Final result: " +
                            JSON.stringify(response);
                        sentrySuccessLog({ message });
                        logger.infoLogging({
                            message: "[Successfully Parse Data!]\n",
                        });
                        sentryInfo({ message: "[Successfully Parse Data!]" });
                    }
                }
            }
            else {
                return;
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            const message = `[Failed To ParseData] \n[Name]: ${error.name} \n[Message]: ${error.message}`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        }
        else {
            console.error("[Failed To Parse Data]: Unknown error occur: " + error);
        }
    }
}
//# sourceMappingURL=parseServices.js.map