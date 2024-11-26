import prismaClient from "../../prisma/index.js";
class User {
    constructor() { }
    async isUserExist(telegramId) {
        const existUser = await prismaClient.user.findUnique({
            where: {
                telegramId: telegramId,
            },
        });
        return existUser;
    }
    async createUser(data) {
        const user = await prismaClient.user.create({
            data: {
                userName: data.userName,
                telegramId: data.telegramId,
            },
        });
        return user;
    }
}
export default User;
