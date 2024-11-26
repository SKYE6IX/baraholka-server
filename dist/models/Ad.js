import prismaClient from "../prisma/index.js";
class Ad {
    constructor(adsData) {
        this.title = adsData.title;
        this.description = adsData.description;
        this.price = adsData.price;
        this.currency = adsData.currency;
        this.source = adsData.source;
    }
    async insertNewAd(authorId, url) {
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
