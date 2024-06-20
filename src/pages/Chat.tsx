import { Helmet } from 'react-helmet';
import MessageInput from "../components/MessageInput";
import Messages from "../components/Messages";
import { useChat } from "../context/ChatContext";

const Chat: React.FC = () => {
    const { state } = useChat();
    return (
        <>
            {state.receiver?.socketId ? (
                <Helmet>
                    <title>Omegle: Connected to Somebody</title>
                </Helmet>
            ) : (
                <Helmet>
                    <title>Omegle: Talk to strangers!</title>
                </Helmet>
            )}
            <div className="w-full h-[calc(100vh-90px)] flex flex-col justify-between">
                <Messages />
                <MessageInput />
            </div>
        </>
    )
}

export default Chat;