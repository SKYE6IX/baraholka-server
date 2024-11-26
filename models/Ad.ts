import prismaClient from "prisma";
import { BaseAd, Location, Image } from "types/ad";

class Ad {
    private userId: string;
    private title: string;
    private description: string;
    private price: number;
    private currency: "GEL" | "USD";
    private source: "TELEGRAM_AD" | "SITE_AD";
    private location: Location;

    constructor(adsData: BaseAd) {
        this.userId = adsData.userId;
        this.title = adsData.title;
        this.description = adsData.description;
        this.price = adsData.price;
        this.currency = adsData.currency;
        this.source = adsData.source;
        this.location = adsData.location;
    }

    public async insertNewAd(images: Image[]) {
        const ad = await prismaClient.ad.create({
            data: {
                title: this.title,
                description: this.description,
                price: this.price,
                currency: this.currency,
                source: this.source,
                images: {
                    createMany: {
                        data: images,
                    },
                },
                userId: this.userId,
                location: {
                    create: {
                        country: this.location.country,
                        city: this.location.city,
                        location: this.location.location,
                    },
                },
            },
        });
        return ad;
    }
}
export default Ad;
