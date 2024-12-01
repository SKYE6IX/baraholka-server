import { Prisma } from "@prisma/client";
import Ad from "models/Ad";
import { BaseAd } from "types/ad";
import Logger from "packages/Logger";

const logger = new Logger({ service: "USER SERVICE" });

export async function createNewAd(adData: BaseAd, urls: string[]) {
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
        return response;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Create New Ad]\n${error.message}`;
            logger.errorLogging({
                message: message,
            });
        } else {
            console.error("[Unknown Error Occur In Create New Ad]:\n" + error);
        }
    }
}

export async function removeAd(adsId: string) {
    if (!adsId) {
        return;
    }
    try {
        const response = await Ad.removeAd(adsId);
        logger.infoLogging({
            message: "[Successfully Remove Ad]\n",
        });
        return response;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Remove Ad]\n${error.message}`;
            logger.errorLogging({
                message: message,
            });
        } else {
            console.error("[Unknown Error Occur In Remove Ad]:\n" + error);
        }
    }
}
