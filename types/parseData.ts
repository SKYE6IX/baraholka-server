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
export interface ResolveParseData {
    title: string;
    price: number;
    currency: "GEL" | "USD";
    location: string | null;
    description: string;
}
