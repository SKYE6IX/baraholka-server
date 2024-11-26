import User from "../models/User.js";
export async function isUserExist(userData) {
    if (!userData.telegramId) {
        console.log("Telegram ID isn't provided");
        return null;
    }
    try {
        return await User.existingUser(userData.telegramId);
    }
    catch (error) {
        console.log(error);
    }
}
export async function createNewUser(userData) {
    if (!userData) {
        return null;
    }
    try {
        const user = new User(userData);
        return user.insertNewUser();
    }
    catch (error) {
        console.log(error);
    }
}
