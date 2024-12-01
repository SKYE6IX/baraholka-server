import prismaClient from "../prisma/index.js";
class Ad {
    constructor(adsData) {
        this.userId = adsData.userId;
        this.title = adsData.title;
        this.description = adsData.description;
        this.price = adsData.price;
        this.currency = adsData.currency;
        this.source = adsData.source;
        this.location = adsData.location;
    }
    async insertNewAd(images) {
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
    static async removeAd(adId) {
        const response = await prismaClient.ad.delete({
            where: {
                id: adId,
            },
            include: {
                images: true,
            },
        });
        return response;
    }
}
export default Ad;
