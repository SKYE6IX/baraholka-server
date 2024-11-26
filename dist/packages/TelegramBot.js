import { TelegramClient } from "telegram";
import { StringSession } from "../../node_modules/telegram/sessions/index.js";
import { NewMessage } from "../../node_modules/telegram/events/index.js";
import readlineSync from "readline-sync";
class TelegramBot {
    constructor(apiId, apiHash, sessionsId) {
        this.timeoutID = null;
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
    async runNewMessageEvent(onNewMessage) {
        const groupMessage = new Map();
        await this.client.connect();
        this.client.addEventHandler(async (event) => {
            const message = event.message;
            if (message.media) {
                const buffer = (await this.client.downloadMedia(message.media));
                if (message.groupedId) {
                    if (!groupMessage.has(message.groupedId.valueOf()) &&
                        message.message) {
                        groupMessage.set(message.groupedId.valueOf(), {
                            message: message.text,
                            user: {
                                telegramId: message.sender?.id &&
                                    BigInt(message.sender?.id.toString()),
                                // @ts-expect-error username isn't in sender type
                                userName: message.sender?.username,
                            },
                            photo: null,
                            photos: [],
                        });
                    }
                    const groupMessages = groupMessage.get(message.groupedId.valueOf());
                    groupMessages?.photos.push(buffer);
                    if (this.timeoutID)
                        clearTimeout(this.timeoutID);
                    this.timeoutID = setTimeout(() => {
                        onNewMessage(groupMessages);
                    }, 2500);
                }
                else {
                    onNewMessage({
                        message: message.text,
                        user: {
                            telegramId: message.sender?.id &&
                                BigInt(message.sender?.id.toString()),
                            // @ts-expect-error username isn't in sender type
                            userName: message.sender?.username,
                        },
                        photo: buffer,
                        photos: [],
                    });
                }
            }
            else {
                return;
            }
        }, new NewMessage({
            chats: ["testch1992", "market_place1992"],
        }));
    }
}
export default TelegramBot;
