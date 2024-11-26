// Type interface for user

export interface BaseUser {
    telegramId: bigint;
    userName: string;
}

export interface User extends BaseUser {
    id: string;
}
