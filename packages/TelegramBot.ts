import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import readlineSync from "readline-sync";
import { NewMessageData } from "types/parseData";
class TelegramBot {
    private client: TelegramClient;
    private timeoutID: NodeJS.Timeout | null = null;
    private timeRemain = 500;

    private singleMediaAds: NewMessageData[] = [];
    private multiMediaAds = new Map<number, NewMessageData>();

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

    private async resolveAds({ message }: { message: Api.Message }) {
        let adData: NewMessageData;
        try {
            // @ts-expect-error Type username isn't added on siender type.
            const userName = message.sender?.username;
            const media = message.media;
            const groupedId = message.groupedId?.valueOf();
            if (userName && media) {
                if (!groupedId) {
                    const buffer = (await this.client.downloadMedia(media)) as Buffer;
                    adData = {
                        message: message.text,
                        user: {
                            userName: userName,
                            telegramId:
                                message.sender?.id &&
                                BigInt(message.sender?.id.toString()),
                        },
                        photo: buffer,
                        photos: [],
                    };
                    this.singleMediaAds.push(adData);
                } else if (groupedId) {
                    const buffer = (await this.client.downloadMedia(media)) as Buffer;
                    if (!this.multiMediaAds.has(groupedId)) {
                        this.multiMediaAds.set(groupedId, {
                            message: message.message,
                            user: {
                                userName: userName,
                                telegramId:
                                    message.sender?.id &&
                                    BigInt(message.sender?.id.toString()),
                            },
                            photo: null,
                            photos: [buffer],
                        });
                    } else {
                        this.multiMediaAds.forEach((ads, key) => {
                            if (key === groupedId) {
                                ads.photos.push(buffer);
                            }
                        });
                    }
                }
            } else {
                console.log("Username and Media isn't included in the message");
            }
        } catch (error) {
            throw new Error("Error occur inside resolve ads block. " + error);
        }
    }

    public async runNewMessageEvent(onNewMessage: (newMessage: NewMessageData) => void) {
        const isConnected = await this.client.connect();
        if (isConnected) {
            this.client.addEventHandler(
                async (event: NewMessageEvent) => {
                    const message = event.message;
                    this.resolveAds({ message })
                        .then(() => {
                            if (this.timeoutID) {
                                clearTimeout(this.timeoutID);
                                this.timeoutID = null;
                            }
                            this.timeoutID = setTimeout(() => {
                                if (this.singleMediaAds.length) {
                                    this.singleMediaAds.forEach((data) => {
                                        onNewMessage(data);
                                    });
                                    this.singleMediaAds = [];
                                }
                                if (this.multiMediaAds) {
                                    this.multiMediaAds.forEach((ads) => {
                                        onNewMessage(ads);
                                    });
                                    this.multiMediaAds.clear();
                                }
                            }, this.timeRemain);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                },
                new NewMessage({
                    chats: ["testch1992", "market_place1992"],
                })
            );
        } else {
            console.log("GramJS Bot is unable to connect........");
            return;
        }
    }
}
export default TelegramBot;
