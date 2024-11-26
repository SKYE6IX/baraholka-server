import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import readlineSync from "readline-sync";

interface NewMessageData {
    message: string;
    user: {
        telegramId: bigint | undefined;
        userName: string | undefined;
    };
    photo: Buffer | null;
    photos: Buffer[];
}

class TelegramBot {
    private client: TelegramClient;
    private timeoutID: NodeJS.Timeout | null = null;

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

    public async runNewMessageEvent(onNewMessage: (newMessage: NewMessageData) => void) {
        const groupMessage = new Map<number, NewMessageData>();
        await this.client.connect();
        this.client.addEventHandler(
            async (event: NewMessageEvent) => {
                const message = event.message;
                if (message.media) {
                    const buffer = (await this.client.downloadMedia(
                        message.media
                    )) as Buffer;
                    if (message.groupedId) {
                        if (
                            !groupMessage.has(message.groupedId.valueOf()) &&
                            message.message
                        ) {
                            groupMessage.set(message.groupedId.valueOf(), {
                                message: message.text,
                                user: {
                                    telegramId:
                                        message.sender?.id &&
                                        BigInt(message.sender?.id.toString()),
                                    // @ts-expect-error username isn't in sender type
                                    userName: message.sender?.username,
                                },
                                photo: null,
                                photos: [],
                            });
                        }
                        const groupMessages = groupMessage.get(
                            message.groupedId.valueOf()
                        ) as NewMessageData;
                        groupMessages?.photos.push(buffer);
                        if (this.timeoutID) clearTimeout(this.timeoutID);

                        this.timeoutID = setTimeout(() => {
                            onNewMessage(groupMessages);
                        }, 2500);
                    } else {
                        onNewMessage({
                            message: message.text,
                            user: {
                                telegramId:
                                    message.sender?.id &&
                                    BigInt(message.sender?.id.toString()),
                                // @ts-expect-error username isn't in sender type
                                userName: message.sender?.username,
                            },
                            photo: buffer,
                            photos: [],
                        });
                    }
                } else {
                    return;
                }
            },
            new NewMessage({
                chats: ["testch1992", "market_place1992"],
            })
        );
    }
}

export default TelegramBot;
