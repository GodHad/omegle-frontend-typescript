import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '../types/user';
import { Message } from '../types/message';
import { Receiver } from '../types/receiver';
import { SignalData } from 'simple-peer';

interface ChatStateType {
    user: User | null;
    socketId: string;
    chatType: number;
    interests: string;
    isSearching: boolean;
    messages: Message[];
    isConnected: boolean;
    receiver: Receiver | null;
    caller: string;
    isTyping: boolean;
    isSending: boolean;
    message: string;
    ipAddress: string;
    signal: string | SignalData;
    onlineUsers: User[];
    unreadMessages: number;
}

interface ChatContextType {
    state: ChatStateType;
    setState: Dispatch<SetStateAction<ChatStateType>>;
}

const initialState: ChatStateType = {
    user: null,
    socketId: '',
    chatType: 0,
    interests: '',
    isSearching: false,
    messages: [],
    isConnected: false,
    receiver: null,
    caller: '',
    isTyping: false,
    isSending: false,
    message: '',
    ipAddress: '',
    signal: '',
    onlineUsers: [],
    unreadMessages: 0
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<ChatStateType>(initialState)
    return (
        <ChatContext.Provider value={{ state, setState }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within an ChatProvider....')
    }
    return context;
}