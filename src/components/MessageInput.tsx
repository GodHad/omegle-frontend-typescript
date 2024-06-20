import { useRef } from 'react';
import { useChat } from "../context/ChatContext";
import html2canvas from "html2canvas";
import axios from 'axios';
import { apiUrl } from "../utils/constant";
import { toast } from 'react-toastify';
import { useSocket } from '../context/SocketContext';

const MessageInput: React.FC = () => {
    const { socket } = useSocket();
    const { state, setState } = useChat();
    const lastSendMsgTime = useRef<number>(0);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    const uploadScreenshot = async (screenshot: string, userId: string) => {
        try {
            const response = await axios.post(`${apiUrl}/upload-screenshot`, {
                screenshot,
                userId,
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Failed to upload screenshot');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Server Error";
                toast.error(message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };

    const captureScreenshot = async (id: string) => {
        const element = document.getElementById(id);
        if (!element) return;
        try {
            const canvas = await html2canvas(element);
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = 600;
            resizedCanvas.height = 480;

            const ctx = resizedCanvas.getContext('2d');
            if (!ctx) {
                console.log('Failed to get 2D context.');
                return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 600, 480);

            return resizedCanvas.toDataURL('image/png');
        } catch (error) {
            console.log(error);
        }
    };

    const handleNewBtnClicked = async () => {
        if (state.chatType === 1 && state.receiver && state.user) {
            const myVideoScreenshot = await captureScreenshot('myVideo');
            const userVideoScreenshot = await captureScreenshot('userVideo');
            if (myVideoScreenshot) await uploadScreenshot(myVideoScreenshot, state.user._id);
            if (userVideoScreenshot) await uploadScreenshot(userVideoScreenshot, state.receiver._id);
        }

        if (state.receiver?.socketId) {
            socket.emit('chat-close', state.receiver.socketId, () => { });
        } else {
            socket.emit('unpairing-user', state.socketId, () => { });
        }

        setState(prevState => ({
            ...prevState,
            receiver: null,
            isTyping: false,
            message: '',
            isSearching: false,
        }));

        newChat();
    };

    const newChat = () => {
        setState(prevState => ({ ...prevState, isSearching: true, messages: [], isSending: false }));
        socket.emit('pairing-user', state.user, state.chatType, state.interests, (error: string) => {
            if (error) {
                console.log(error);
            }
            return;
        });

        return () => {
            socket.off('pairing-user');
        };
    };

    const sendMessage = () => {
        if (state.isSending) return;
        if (state.message === '') return;
        setState(prevState => ({ ...prevState, isSending: true }));
        socket.emit('send-message', state.receiver?.socketId, state.message, () => {
            setState(prevState => ({ ...prevState, message: '' }));
        });
    };

    const disconnectChat = async () => {
        if (state.chatType === 1 && state.receiver && state.user) {
            const myVideoScreenshot = await captureScreenshot('myVideo');
            const userVideoScreenshot = await captureScreenshot('userVideo');
            if (myVideoScreenshot) await uploadScreenshot(myVideoScreenshot, state.user._id);
            if (userVideoScreenshot) await uploadScreenshot(userVideoScreenshot, state.receiver._id);
        }
        if (state.receiver?.socketId) {
            socket.emit('chat-close', state.receiver.socketId, () => {
                setState(prevState => ({ ...prevState, receiver: null, isTyping: false, message: '' }));
            });
        } else {
            socket.emit('unpairing-user', state.socketId, () => {
                setState(prevState => ({ ...prevState, isSearching: false }));
            });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendTypingStop = () => {
        socket.emit('typing stop', state.receiver?.socketId);
    }

    const typingHandle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;

        if (target.value !== '') {
            socket.emit('typing', state.receiver?.socketId);
            lastSendMsgTime.current = Date.now();

            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }

            typingTimeout.current = setTimeout(() => {
                sendTypingStop();
            }, 1000);
        } else {
            socket.emit('typing stop', state.receiver?.socketId);
        }
    };

    return (
        <div className="sm:flex sm:flex-row-reverse gap-1.5 sm:m-3 m-1">
            <div className="flex w-full">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="sm:border sm:border-slate-300 border-t border-l border-slate-300 border-r-0 border-b-0 outline-none w-full p-4 text-lg rounded border disabled:bg-slate-100 disabled:dark:bg-slate-300"
                    onChange={(e) => {
                        setState(prevState => ({ ...prevState, message: e.target.value }));
                        typingHandle(e);
                    }}
                    value={state.message}
                    onKeyDown={handleKeyPress}
                    disabled={!state.receiver}
                />
                <button
                    className="p-4 text-lg rounded bg-blue-500 text-white disabled:text-white-300 disabled:dark:bg-slate-400 disabled:bg-slate-300 border dark:border-slate-800"
                    onClick={sendMessage}
                    disabled={!state.receiver || state.isSending}
                >
                    Send
                </button>
            </div>
            <div className="flex">
                <button
                    className="w-full sm:max-w-fit p-4 text-lg font-semibold rounded bg-blue-500 text-white"
                    onClick={handleNewBtnClicked}
                >
                    New
                </button>
                <button
                    className="bg-red-500 w-full sm:max-w-fit p-4 text-lg font-semibold rounded text-white disabled:text-white-300 disabled:dark:bg-slate-400 disabled:bg-slate-300"
                    onClick={disconnectChat}
                    disabled={!state.receiver}
                >
                    Stop
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
