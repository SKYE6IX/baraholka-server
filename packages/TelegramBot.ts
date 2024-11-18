import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import readlineSync from "readline-sync";

class TelegramBot {
    private client: TelegramClient;

    constructor(apiId: number, apiHash: string, sessionsId: string) {
        this.client = new TelegramClient(new StringSession(sessionsId), apiId, apiHash, {
            connectionRetries: 5,
            useWSS: true,
        });
    }
    public async startBot() {
        await this.client.start({
            phoneNumber: async () =>
                new Promise((resolve) => resolve(readlineSync.question("Number ?"))),
            password: async () =>
                new Promise((resolve) => resolve(readlineSync.question("Password ?"))),
            phoneCode: async () =>
                new Promise((resolve) => resolve(readlineSync.question("OTP ?"))),
            onError: (err) => console.log(err),
        });
        this.client.session.save();
    }

    public async getAdsContent() {
        await this.client.connect();
        this.client.addEventHandler(
            async (event: NewMessageEvent) => {
                const media = await event.message.downloadMedia();
                console.log(media);
            },
            new NewMessage({
                chats: ["testch1992"],
            })
        );
    }
}

export default TelegramBot;
