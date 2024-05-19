export interface IOhmyapiParams {
    token: string;
    endpoint?: string;
}

export interface IOhmyapiCallParams {
    action: string;
    data?: any;
    cache?: boolean;
    auth?: boolean;
}

export interface IOhmyapiCallResponse<T = any> {
    status: boolean;
    code: number;
    i18n: string;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        last?: number;
        total?: number;
        took?: number;
    },
    data?: T;
}

export interface IOhmyapiAction {
    name: string;
    description: string;
    params: object;
    visibility: 'published';
    nodes: string[];
    permissions: string[];
}