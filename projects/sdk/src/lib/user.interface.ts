export interface IUserProfile {
    id: number;
    firstname?: string;
    lastname?: string;
    nickname: string;
    email: string;
    emailVerified: boolean;
    phone?: string;
    phoneVerified: boolean;
    phoneCountryCode?: string;
    deleted: boolean;
    deletedAt?: Date;
    ready: boolean;
    readiedAt?: Date;
    banned: boolean;
    bannedAt?: Date;
    bannedReason?: string;
    version: string;
}

export interface IUserWallet {
    id: number;
    balance: number;
}