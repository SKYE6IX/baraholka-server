import prismaClient from "prisma";
import { BaseAd } from "types/ad";

class Ad {
    private title: string;
    private description: string;
    private price: number;
    private currency: "GEL" | "USD";
    private source: "TELEGRAM_AD" | "SITE_AD";

    constructor(adsData: BaseAd) {
        this.title = adsData.title;
        this.description = adsData.description;
        this.price = adsData.price;
        this.currency = adsData.currency;
        this.source = adsData.source;
    }

    public async insertNewAd(authorId: string, url: string) {
        const ad = await prismaClient.ad.create({
            data: {
                title: this.title,
                description: this.description,
                price: this.price,
                currency: this.currency,
                source: this.source,
                images: {
                    create: [{ url: url }],
                },
                userId: authorId,
            },
        });
        return ad;
    }
}

export default Ad;
