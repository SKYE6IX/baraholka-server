import prismaClient from "../prisma/index.js";
class User {
    constructor(userData) {
        this.userName = userData.userName;
        this.telegramId = userData.telegramId;
    }
    static async existingUser(telegramId) {
        const existUser = await prismaClient.user.findUnique({
            where: {
                telegramId: telegramId,
            },
        });
        return existUser;
    }
    static async deletUser(telegramId) {
        const result = await prismaClient.user.update({
            where: {
                telegramId: telegramId,
            },
            data: {
                ads: {
                    deleteMany: {},
                },
            },
        });
        return result;
    }
    async insertNewUser() {
        const user = await prismaClient.user.create({
            data: {
                userName: this.userName,
                telegramId: this.telegramId,
            },
        });
        return user;
    }
}
export default User;
