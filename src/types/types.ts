export interface IUser {
    id: string;
    name: string;
};

export interface IMessage {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
};