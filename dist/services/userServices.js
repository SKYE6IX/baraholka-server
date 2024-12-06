import { Prisma } from "@prisma/client";
import User from "../models/User.js";
import Logger from "../packages/Logger.js";
const logger = new Logger({ service: "USER SERVICE" });
export async function isUserExist(userData) {
    if (!userData.telegramId) {
        return null;
    }
    try {
        const existingUser = await User.existingUser(userData.telegramId);
        logger.infoLogging({
            message: "[Successfully Found User!]\n",
        });
        return existingUser;
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Find Existing User]\n ${error.message}`;
            logger.errorLogging({
                message: message,
            });
        }
        else {
            console.error("[Unknown Error Occur In Find User]:\n" + error);
        }
    }
}
export async function createNewUser(userData) {
    if (!userData) {
        return null;
    }
    try {
        const user = new User(userData);
        const newUser = await user.insertNewUser();
        logger.infoLogging({
            message: "[Successfully Added New User!]\n",
        });
        return newUser;
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const message = `[Failed To Create New User]\n ${error.message}`;
            logger.errorLogging({
                message: message,
            });
        }
        else {
            console.error("[Unknown Error Occur In Create New User]:\n" + error);
        }
    }
}
//# sourceMappingURL=userServices.js.map