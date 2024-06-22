import { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChat } from './ChatContext';
import { apiUrl } from '../utils/constant';
import { toast } from 'react-toastify';
import { User } from '../types/user';
import { Receiver } from '../types/receiver';
import { SignalData } from 'simple-peer';

const socket = io(apiUrl, {
    autoConnect: false,
    reconnectionAttempts: 5
});

interface SocketContextType {
    socket: Socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { state, setState } = useChat();

    useEffect(() => {
        socket.connect();
        console.log("socket connected");
        
        return () => {
            socket.disconnect();
            console.log("socket disconnected...");
        };
    }, []);

    useEffect(() => {
        const onConnect = () => {
            setState(prevState => ({ ...prevState, isConnected: true }));
        };

        const onDisconnect = () => {
            setState(prevState => ({ ...prevState, isConnected: false }));
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [setState]);

    useEffect(() => {
        if (state.user) {
            socket.emit("new-online-user", state.user, (error: string) => {
                if (error) toast.warn(error);
            });
        }
    }, [state.user]);

    useEffect(() => {
        const onGetUserId = (socketId: string) => {
            setState(prevState => ({ ...prevState, socketId }));
        };

        const onGetOnlineUsers = (onlineUsers: User[]) => {
            setState(prevState => {
                const receiverExists = prevState.receiver && onlineUsers.some(user => user._id === prevState.receiver?.socketId);

                if (prevState.receiver && !receiverExists) {
                    socket.emit('chat-close', prevState.receiver.socketId, () => {
                        setState(prev => ({ ...prev, receiver: null, isTyping: false, message: '' }));
                    });
                }

                return { ...prevState, onlineUsers };
            });
        };

        const onSendMessage = (message: string) => {
            setState(prevState => ({
                ...prevState,
                messages: [...prevState.messages, { isMine: false, content: message }],
                unreadMessages: prevState.unreadMessages + 1,
                isTyping: false
            }));
        };

        const onReceiveMessage = (message: string) => {
            setState(prevState => ({
                ...prevState,
                messages: [...prevState.messages, { isMine: true, content: message }],
                isSending: false
            }));
        };

        const onUserPaired = (receiver: string, caller: string) => {
            console.log(JSON.parse(receiver))
            setState(prevState => ({ ...prevState, receiver: JSON.parse(receiver) as Receiver, caller, isSearching: false }));
        };

        const onGetVideoStream = (signal: string | SignalData) => {
            setState(prevState => ({ ...prevState, signal }));
        };

        const onChatClose = () => {
            setState(prevState => ({ ...prevState, receiver: null, message: '', isTyping: false }));
        };

        const onTyping = () => {
            setState(prevState => ({ ...prevState, isTyping: true }));
        };

        const onTypingStop = () => {
            setState(prevState => ({ ...prevState, isTyping: false }));
        };

        socket.on('get-user-id', onGetUserId);
        socket.on('get-online-users', onGetOnlineUsers);
        socket.on('send-message', onSendMessage);
        socket.on('receive-message', onReceiveMessage);
        socket.on('user-paired', onUserPaired);
        socket.on('get-video-stream', onGetVideoStream);
        socket.on('chat-close', onChatClose);
        socket.on('typing', onTyping);
        socket.on('typing stop', onTypingStop);

        return () => {
            socket.off('get-user-id', onGetUserId);
            socket.off('get-online-users', onGetOnlineUsers);
            socket.off('send-message', onSendMessage);
            socket.off('receive-message', onReceiveMessage);
            socket.off('user-paired', onUserPaired);
            socket.off('get-video-stream', onGetVideoStream);
            socket.off('chat-close', onChatClose);
            socket.off('typing', onTyping);
            socket.off('typing stop', onTypingStop);
        };
    }, [setState]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
