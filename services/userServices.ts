import { Prisma } from "@prisma/client";
import User from "models/User";
import { BaseUser } from "types/user";
import Logger from "packages/Logger";
import { sentryInfo, sentryError } from "./sentryHandlers";

const logger = new Logger({ service: "USER SERVICE" });

export async function isUserExist(userData: BaseUser) {
    if (!userData.telegramId) {
        return null;
    }
    try {
        const existingUser = await User.existingUser(userData.telegramId);
        logger.infoLogging({
            message: "[Successfully Found User!]\n",
        });
        sentryInfo({ message: "[Successfully Found User!]" });
        return existingUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Find Existing User]\n ${error.message}`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        } else {
            console.error("[Unknown Error Occur In Find User]:\n" + error);
        }
    }
}

export async function createNewUser(userData: BaseUser) {
    if (!userData) {
        return null;
    }
    try {
        const user = new User(userData);
        const newUser = await user.insertNewUser();
        logger.infoLogging({
            message: "[Successfully Added New User!]\n",
        });
        sentryInfo({ message: "[Successfully Added New User!]" });
        return newUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Create New User]\n ${error.message}`;
            logger.errorLogging({
                message: message,
            });
            sentryError({ message });
        } else {
            console.error("[Unknown Error Occur In Create New User]:\n" + error);
        }
    }
}
