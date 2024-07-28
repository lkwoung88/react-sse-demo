export interface NotificationResponse extends Response {
    id: number;
    content: string;
    registerDate: string;
}

export interface Response {
    code?: number;
    message?: string;
}