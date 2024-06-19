import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from "../context/AuthContext";
import { useChat } from '../context/ChatContext';
import { apiUrl } from '../utils/constant';
import usaFlag from '../assets/usaFlag.jpg';
import TermsModal from '../components/TermsModal';
import TermsVideoModal from '../components/TermsVideoModal';
import { useSocket } from '../context/SocketContext';

const Home: React.FC = () => {
    const { login } = useAuth();
    const { state, setState } = useChat();
    const { socket } = useSocket();

    const [isTermsModal, setIsTermsModal] = useState<boolean>(false);
    const [isTermsVideoModal, setIsTermsVideoModal] = useState<boolean>(false);

    const handleFetchError = useCallback((error: unknown) => {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Server Error";
            toast.error(message);
            console.log(message)
        } else {
            toast.error("An unknown error occurred");
        }
    }, []);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const ipResponse = await axios.get('http://ip-api.com/json');

                const userResponse = await axios.post(`${apiUrl}/login`, ipResponse.data);
                const user = userResponse.data;

                login(user)
                setState((prevState) => ({
                    ...prevState,
                    user
                }))
                console.log(user)
            } catch (error) {
                handleFetchError(error);
            }
        }

        fetchUserData();
        if (state.socketId) {
            socket.emit('unpairing-user', state.socketId, () => {
                setState((prevState) => ({
                    ...prevState,
                    isSearching: false
                }))
            })
        }

        if (state.receiver) {
            socket.emit('chat-close', state.receiver.socketId, () => {
                setState((prevState) => ({
                    ...prevState,
                    receiver: null,
                    isTyping: false,
                    message: '',
                    isSearching: false
                }))
            })
        }
    }, [])

    const onTextBtnClicked = () => {
        setIsTermsModal(true);
    }

    const onVideoBtnClicked = () => {
        setIsTermsVideoModal(true);
    }

    return (
        <>
            <div className="desktop p-4 mx-auto border border-gray-300 rounded-lg overflow-hidden sm:block hidden">
                <p className="text-center text-sm font-semibold">
                    You don't need an app to use Omegle on your phone or tablet! The web site works great on mobile.
                </p>
                <div className="flex justify-center">
                    <img src={usaFlag} alt="USA Flag" className="h-44 w-80 my-5 object-cover bg-gray-50" />
                </div>
                <p className="text-base leading-6">
                    Omegle (oh-meg-ull) is a great way to meet new friends. When you use Omegle, we pick someone else at random and let you talk one-on-one. To help you stay safe, chats are anonymous unless you tell someone who you are (not suggested!), and you can stop a chat at any time. Predators have been known to use Omegle, so please be careful.
                </p>
                <p className="text-base leading-6 mt-2">
                    If you prefer, you can add your interests, and Omegle will look for someone who's into some of the same things as you instead of someone completely random.
                </p>
                <p className="text-xs text-center font-medium mt-4">
                    By using Omegle, you accept the terms at the bottom. You must be 18+ or 13+ with parental permission.
                </p>
                <div className="w-fit px-10 py-5 my-5 bg-blue-100 rounded-md mx-auto flex flex-col justify-center items-center gap-2">
                    <p className="text-xl font-semibold">Video is monitored. Keep it clean!</p>
                </div>
                <div className="mb-2 flex justify-between">
                    <div>
                        <div className="text-center text-lg mb-1">What do you wanna talk about?</div>
                        <input
                            type="text"
                            placeholder="Add your interests(optional)"
                            className="text-left text-lg p-3 w-80 border border-gray-300 rounded"
                            onChange={(e) => setState((prevState) => ({
                                ...prevState,
                                interests: e.target.value
                            }))}
                        />
                    </div>
                    <div>
                        <p className="text-center text-lg mb-1">Let's jump!</p>
                        <div className="flex gap-2 items-center">
                            <button className="text-lg text-white font-semibold w-28 p-3 bg-blue-500 rounded" onClick={onTextBtnClicked}>Text</button>
                            <p>or</p>
                            <button className="text-lg text-white font-semibold w-28 p-3 bg-red-500 rounded" onClick={onVideoBtnClicked}>Video</button>
                        </div>
                    </div>
                </div>
                <div className="text-center underline text-blue-500">
                    <Link to="/admin">Go to Admin Page</Link>
                </div>
            </div>
            <div className="mobile mt-4 border border-gray-300 p-4 sm:hidden block">
                <div className="text-center leading-6 p-2">
                    Mobile video chat is an experimental new feature. Video is monitored, so keep it clean!
                </div>
                <div className="text-center leading-6 p-2">
                    Go to <span className="text-blue-500 underline cursor-pointer">an adult site</span> if that's what you want, and you are 18 or older.
                </div>
                <div className="py-2 flex justify-center gap-4">
                    <button className="text-lg text-white font-semibold p-2.5 border border-gray-300 rounded bg-blue-500" onClick={onTextBtnClicked}>Start a chat</button>
                    <button className="text-lg text-white font-semibold p-2.5 border border-gray-300 rounded bg-red-500" onClick={onVideoBtnClicked}>Video</button>
                </div>
                <div>
                    <div className="text-center pt-2 pb-1 text-lg">Meet strangers with your interests!</div>
                    <input
                        type="text"
                        placeholder="Add your interests (optional)"
                        className="text-lg p-2 w-full border border-gray-200 rounded"
                        onChange={(e) => setState((prevState) => ({
                            ...prevState,
                            interests: e.target.value
                        }))}
                    />
                </div>
                <div className="leading-6 p-2 mt-2">
                    Omegle (omegul) is a great way to meet new friends, even while practicing social distancing. When you use Omegle, you are paired randomly with another person to talk one-on-one. If you prefer, you can add your interests and you'll be randomly paired with someone who selected some of the same interests.
                </div>
                <div className="text-center underline text-blue-500">
                    <Link to="/admin">Go to Admin Page</Link>
                </div>
            </div>
            {isTermsModal && <TermsModal setIsTermsModal={setIsTermsModal} />}
            {isTermsVideoModal && <TermsVideoModal setIsTermsVideoModal={setIsTermsVideoModal} />}
        </>
    )
}

export default Home;