export interface User {
    _id: string;
    ipAddress: string;
    socketId: string;
    city: string;
    state: string;
    country: string;
    status: boolean;
    admin: boolean;
    last_login_machine_info: string;
}