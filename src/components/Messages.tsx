import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { useSocket } from '../context/SocketContext';

const Messages: React.FC = () => {
    const { state, setState } = useChat();
    const { socket } = useSocket();
    const messagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [state.messages]);

    useEffect(() => {
        if (!!!state.receiver) newChat();
        return () => {
            socket.off('pairing-user');
        };
    }, []);

    const newChat = () => {
        setState(prevState => ({ ...prevState, isSearching: true, messages: [] }));
        socket.emit('pairing-user', state.user, state.chatType, state.interests, (error: string) => {
            if (error) {
                toast.error(error);
            }
        });

        return () => {
            socket.off('pairing-user');
        };
    };

    const takeScreenshot = () => {
        const element: HTMLElement | null = document.getElementById('savedchat');
        if (!element) return;
        html2canvas(element).then((canvas) => {
            const screenshot = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = screenshot;
            downloadLink.download = 'screenshot.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    };

    return (
        <div id="savedchat" className="sm:h-[calc(100vh-175px)] h-[calc(100vh-220px)] p-2 overflow-y-scroll border border-slate-200 rounded-md m-2 dark:text-slate-200" ref={messagesRef}>
            {!state.isSearching && !state.receiver && (
                <p className="text-center mb-2">Omegle : talk to strangers</p>
            )}

            {state.receiver && <p className="text-center">You’re now chatting with a random stranger. His/Her interests is {state.receiver.interests !== '' ? '"' + state.receiver.interests + '"' : 'not set.'}</p>}
            {state.messages && state.messages.map((message, index) => (
                <div key={index} className={message?.isMine ? "flex" : "flex justify-end"}>
                    <div className={"mt-3 text-lg mb-2 flex gap-1"}>
                        <p className={`font-bold ${message.isMine ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
                            {message?.isMine ? "Stranger: " : "You: "}
                        </p>
                        <p>{message.content}</p>
                    </div>
                </div>
            ))}

            {state.isTyping && <p className="mt-1 text-center">Stranger is typing...</p>}

            {state.isSearching && <p className="text-center sm:hidden block">Connecting to server...</p>}
            {state.isSearching && <p className="text-center sm:block hidden">Looking for someone you can chat with...</p>}

            {!state.isSearching && !state.receiver && (
                <>
                    <p className="text-center sm:hidden block text-slate-300 font-semibold my-4">Stranger has disconnected.</p>
                    <p className="text-center sm:block hidden text-slate-300 font-semibold my-4">Your conversational partner has disconnected</p>
                    <div className="sm:hidden flex flex-col justify-center items-center">
                        <p className="text-center text-sm"><span><input type="checkbox" /></span> Find strangers with common interests <span className="text-blue-500 underline cursor-pointer">Settings</span></p>
                        <p className="text-center text-lg font-semibold mt-2 bg-orange-500 p-2 rounded-md cursor-pointer text-white" onClick={takeScreenshot}>Great Chat? Save the log!</p>
                    </div>
                    <div className="sm:flex hidden gap-1 items-center justify-center items-center">
                        <button onClick={newChat}>Start a new conversation</button>
                        <p>or</p>
                        <span className="text-blue-500 underline cursor-pointer" onClick={takeScreenshot}>save this log</span>
                        <p>or</p>
                        <span className="text-blue-500 underline cursor-pointer">send us feedback</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Messages;
