import prismaClient from "prisma";
import { BaseUser } from "types/user";

class User {
    private userName: string;
    private telegramId: bigint;

    constructor(userData: BaseUser) {
        this.userName = userData.userName;
        this.telegramId = userData.telegramId;
    }

    public static async existingUser(telegramId: bigint) {
        const existUser = await prismaClient.user.findUnique({
            where: {
                telegramId: telegramId,
            },
        });
        return existUser;
    }

    public static async deletUser(telegramId: bigint) {
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

    public async insertNewUser() {
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
