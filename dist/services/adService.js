import Ad from "../models/Ad.js";
export async function createNewAd(userId, adData, url) {
    if (!userId || !adData) {
        return;
    }
    try {
        const newAd = new Ad(adData);
        console.log("Successfully add new AD to Database");
        return await newAd.insertNewAd(userId, url);
    }
    catch (error) {
        console.log(error);
        console.log("Failed to add AD to database ");
    }
}
