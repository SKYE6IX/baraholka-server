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
        const isConnected = await this.client.connect();
        if (isConnected) {
            const groupMessage = new Map();
            this.client.addEventHandler(async (event) => {
                const message = event.message;
                // @ts-expect-error Type username isn't added on sender type.
                const userName = await message.sender?.username;
                const media = message.media;
                if (userName && media) {
                    const buffer = (await this.client.downloadMedia(media));
                    if (message.groupedId) {
                        // Message with multiple images
                        if (!groupMessage.has(message.groupedId.valueOf()) &&
                            message.message) {
                            groupMessage.set(message.groupedId.valueOf(), {
                                message: message.text,
                                user: {
                                    telegramId: message.sender?.id &&
                                        BigInt(message.sender?.id.toString()),
                                    userName: userName,
                                },
                                photo: null,
                                photos: [],
                            });
                        }
                        const getMessages = groupMessage.get(message.groupedId.valueOf());
                        getMessages.photos.push(buffer);
                        if (this.timeoutID)
                            clearTimeout(this.timeoutID);
                        this.timeoutID = setTimeout(() => {
                            onNewMessage(getMessages);
                        }, 2500);
                    }
                    else {
                        // Message with single image
                        onNewMessage({
                            message: message.text,
                            user: {
                                telegramId: message.sender?.id &&
                                    BigInt(message.sender?.id.toString()),
                                userName: userName,
                            },
                            photo: buffer,
                            photos: [],
                        });
                    }
                }
                else {
                    console.log("Failed to process new message because there is no media or username");
                    return;
                }
            }, new NewMessage({
                chats: ["testch1992", "market_place1992"],
            }));
        }
        else {
            console.log("GramJS Bot is unable to connect........");
            return;
        }
    }
}
export default TelegramBot;
//# sourceMappingURL=TelegramBot.js.map