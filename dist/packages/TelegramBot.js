import { TelegramClient } from "telegram";
import { StringSession } from "../../node_modules/telegram/sessions/index.js";
import readlineSync from "readline-sync";
class TelegramBot {
    constructor(apiId, apiHash, sessionsId) {
        this.client = new TelegramClient(new StringSession(sessionsId), apiId, apiHash, {
            connectionRetries: 5,
            useWSS: true,
        });
    }
    async startBot() {
        await this.client.start({
            phoneNumber: async () => new Promise((resolve) => resolve(readlineSync.question("Number ?"))),
            password: async () => new Promise((resolve) => resolve(readlineSync.question("Password ?"))),
            phoneCode: async () => new Promise((resolve) => resolve(readlineSync.question("OTP ?"))),
            onError: (err) => console.log(err),
        });
        this.client.session.save();
    }
}
export default TelegramBot;
