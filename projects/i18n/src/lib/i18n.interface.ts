export interface II18NLanguageMap {
    [key: string]: {
        dir: 'rtl' | 'ltr'
        font?: string;
        map: II18NLanguage;
    };
}

export interface II18NLanguage {
    [key: string]: string;
}

export interface II18NLoadParams {
    key: string;
    url: string;
    dir?: TI18NDirection;
    font?: string;
    current?: boolean;
}

export type TI18NDirection = 'ltr' | 'rtl';