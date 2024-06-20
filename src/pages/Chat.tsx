import MessageInput from "../components/MessageInput";
import Messages from "../components/Messages";

const Chat: React.FC = () => {
    return (
        <>
            <div className="w-full h-[calc(100vh-90px)] flex flex-col justify-between">
                <Messages />
                <MessageInput />
            </div>
        </>
    )
}

export default Chat;