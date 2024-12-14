import { Prisma } from "@prisma/client";
import Ad from "../models/Ad.js";
import Logger from "../packages/Logger.js";
import { sentryInfo, sentryError } from "./sentryHandlers.js";
const logger = new Logger({ service: "ADs SERVICE" });
export async function createNewAd(adData, urls) {
    if (!adData || !urls) {
        return;
    }
    try {
        const newAd = new Ad(adData);
        const imagesUrl = urls.map((u) => {
            return {
                url: u,
            };
        });
        const response = await newAd.insertNewAd(imagesUrl);
        logger.infoLogging({
            message: "[Successfully Added New Ad]\n",
        });
        sentryInfo({ message: "[Successfully Added New Ad!]" });
        return response;
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Create New Ad]\n${error.message}`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        }
        else {
            console.error("[Unknown Error Occur In Create New Ad]:\n" + error);
        }
    }
}
export async function removeAd(adsId) {
    if (!adsId) {
        return;
    }
    try {
        const response = await Ad.removeAd(adsId);
        logger.infoLogging({
            message: "[Successfully Remove Ad]\n",
        });
        return response;
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Remove Ad]\n${error.message}`;
            logger.errorLogging({
                message: message,
            });
        }
        else {
            console.error("[Unknown Error Occur In Remove Ad]:\n" + error);
        }
    }
}
//# sourceMappingURL=adService.js.map