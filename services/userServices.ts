import User from "models/User";
import { BaseUser } from "types/user";

export async function isUserExist(userData: BaseUser) {
    if (!userData.telegramId) {
        console.log("Telegram ID isn't provided");
        return null;
    }
    try {
        return await User.existingUser(userData.telegramId);
    } catch (error) {
        console.log(error);
    }
}

export async function createNewUser(userData: BaseUser) {
    if (!userData) {
        return null;
    }
    try {
        const user = new User(userData);
        return user.insertNewUser();
    } catch (error) {
        console.log(error);
    }
}
