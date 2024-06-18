import { User } from "./user";

export interface Receiver extends User {
    socketId: string;
    interests: string;
}