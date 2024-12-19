import OpenAI from "openai";
import { S3ServiceException } from "@aws-sdk/client-s3";
import TelegramBot from "packages/TelegramBot";
import GPTClient from "packages/GPTClient";
import S3 from "packages/S3";
import { createNewUser, isUserExist } from "./userServices";
import { createNewAd } from "./adService";
import { User } from "types/user";
import { BaseAd } from "types/ad";
import { NewMessageData, ResolveParseData } from "types/parseData";
import Logger from "packages/Logger";
import { sentryInfo, sentryError, sentrySuccessLog } from "./sentryHandlers";

const {
    TELEGRAM_API_ID,
    TELEGRAM_API_HASH,
    TELEGRAM_SESSION_ID,
    OPEN_AI_KEY,
    OPEN_AI_ORG_ID,
    OPEN_AI_PROJECT_ID,
} = process.env;

const telegramBot = new TelegramBot(
    Number(TELEGRAM_API_ID),
    TELEGRAM_API_HASH,
    TELEGRAM_SESSION_ID
);

const gptClient = new GPTClient(OPEN_AI_KEY, OPEN_AI_ORG_ID, OPEN_AI_PROJECT_ID);

const logger = new Logger({ service: "PARSE DATA SERVICE" });

export function startBot() {
    telegramBot.startBot();
}

export async function getNormalizedData(message: string) {
    try {
        const response = await gptClient.parseMessage(message);
        if (response) {
            const ads = JSON.parse(response) as ResolveParseData;
            logger.infoLogging({
                message: "[Successfully Normalized!]\n",
            });
            sentryInfo({ message: "[Successfully Normalized!]" });
            return ads;
        } else {
            return;
        }
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const message = `[Failed To Normalized]\n ${error.message}\n`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        } else {
            console.error("[Failed To Normalized]: Unknown error occur: " + error);
        }
    }
}

async function getMediaUrl(data: NewMessageData, title: string) {
    try {
        const tempArray: string[] = [];
        if (data.photo) {
            const url = (await S3.uploadSingleImage(data.photo, title)) as string;
            tempArray.push(url);
            logger.infoLogging({
                message: "[Successfully get media url!]\n",
            });
            sentryInfo({ message: "[Successfully get media url!]" });
            return tempArray;
        } else if (data.photos) {
            const urlList = (await S3.uploadMultipleImage(
                data.photos,
                title
            )) as string[];
            logger.infoLogging({
                message: "[Successfully get media urls!]\n",
            });
            sentryInfo({ message: "[Successfully get media url!]" });
            return urlList;
        }
    } catch (error) {
        if (error instanceof S3ServiceException) {
            const message = `[Failed To GetURL] \n[Name]: ${error.name} \n[Message]: ${error.message}`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        } else {
            console.error("[Failed To GetURL]: Unknown error occur: " + error);
        }
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
        if (error instanceof S3ServiceException) {
            const message = `[Failed To Remove Media] \n[Name]: ${error.name} \n[Message]: ${error.message}`;
            logger.errorLogging({
                message: message,
            });
        } else {
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
                    } else {
                        const message =
                            "Message parse: " +
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
            } else {
                return;
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            const message = `[Failed To ParseData] \n[Name]: ${error.name} \n[Message]: ${error.message}`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        } else {
            console.error("[Failed To Parse Data]: Unknown error occur: " + error);
        }
    }
}
