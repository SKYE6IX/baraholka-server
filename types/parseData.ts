//
//
export interface NewMessageData {
    message: string;
    user: {
        telegramId: bigint | undefined;
        userName: string | undefined;
    };
    photo: Buffer | null;
    photos: Buffer[];
}
