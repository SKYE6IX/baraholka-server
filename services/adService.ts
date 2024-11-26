import Ad from "models/Ad";
import { BaseAd } from "types/ad";

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
        console.log("Successfully add new AD to Database");
        return response;
    } catch (error) {
        console.log(error);
        console.log("Failed to add AD to database ");
    }
}
