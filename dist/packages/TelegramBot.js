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
        // const groupMessage = new Map<number, NewMessageData>();
        await this.client.connect();
        this.client.addEventHandler(async (event) => {
            const message = event.message;
            // @ts-expect-error Type username wasn't added on sender type.
            const userName = await message.sender?.username;
            const media = message.media;
            if (userName && media) {
                const buffer = (await this.client.downloadMedia(media));
                if (message.groupedId) {
                    // Message with multiple images
                }
                else {
                    // Message with single image
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
// const buffer = (await this.client.downloadMedia(message.media)) as Buffer;
// if (message.groupedId) {
//     if (!groupMessage.has(message.groupedId.valueOf()) && message.message) {
//         groupMessage.set(message.groupedId.valueOf(), {
//             message: message.text,
//             user: {
//                 telegramId: message.sender?.id && BigInt(message.sender?.id.toString()),
//                 // @ts-expect-error username isn't in sender type
//                 userName: message.sender?.username,
//             },
//             photo: null,
//             photos: [],
//         });
//     }
//     const groupMessages = groupMessage.get(message.groupedId.valueOf()) as NewMessageData;
//     groupMessages?.photos.push(buffer);
//     if (this.timeoutID) clearTimeout(this.timeoutID);
//     this.timeoutID = setTimeout(() => {
//         onNewMessage(groupMessages);
//     }, 2500);
// } else {
// onNewMessage({
//     message: message.text,
//     user: {
//         telegramId: message.sender?.id && BigInt(message.sender?.id.toString()),
//         // @ts-expect-error username isn't in sender type
//         userName: message.sender?.username,
//     },
//     photo: buffer,
//     photos: [],
//     });
// }
