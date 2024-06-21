import { useRef, useEffect, useState } from 'react';
import { useChat } from "../context/ChatContext";
import html2canvas from 'html2canvas';
import Peer from 'simple-peer';
import { toast } from 'react-toastify';
import Messages from '../components/Messages';
import MessageInput from '../components/MessageInput';
import { useSocket } from '../context/SocketContext';

const Video: React.FC = () => {
    const { state } = useChat();
    const { socket } = useSocket();
    const myVideo = useRef<HTMLVideoElement | null>(null);
    const userVideo = useRef<HTMLVideoElement | null>(null);
    const connectionRef = useRef<Peer.Instance | null>(null);
    const [stream, setStream] = useState<MediaStream | undefined>(undefined);
    const [callAccepted, setCallAccepted] = useState<boolean>(false)

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                })
                setStream(mediaStream);
            } catch (error: unknown) {
                toast.error("Camera Error!!! Please Check your camera again!")
            }
        }
        getMediaStream();
    }, [])

    useEffect(() => {
        if (state.signal) {
            setCallAccepted(true);
            answerCall();
        } else {
            setCallAccepted(false)
        }
    }, [state.signal])

    const callUser = (socketId: string) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', data => {
            socket.emit('callUser', data, socketId, (error: string) => {
                if (error) console.error(error)
            })
        })

        peer.on('stream', (currentStream) => {
            if (userVideo.current) userVideo.current.srcObject = currentStream
        })

        peer.on('close', () => {
            socket.off('callAccepted')
        })

        peer.on('error', console.error)

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        const peer = new Peer({ initiator: false, trickle: false, stream })

        peer.on('signal', (data) => {
            if (state.receiver)
                socket.emit('answerCall', { signal: data, to: state.receiver.socketId })
        })

        peer.on('stream', (currentStream) => {
            if (userVideo.current) userVideo.current.srcObject = currentStream
        })

        peer.on('close', () => {
            socket.off('callAccepted')
        })

        peer.on('error', console.error)

        peer.signal(state.signal)

        connectionRef.current = peer
    }

    useEffect(() => {
        if (myVideo.current) {
            myVideo.current.srcObject = stream || null;
        }

        if (state.receiver?.socketId && state.caller && stream) {
            if (state.caller === 'sender') {
                callUser(state.receiver.socketId)
            }
        }

        if (!state.receiver && connectionRef.current) {
            connectionRef.current.destroy()
        }
    }, [state.receiver, state.caller, stream])

    const takeScreenshot = (id: string) => {
        const element = document.getElementById(id);
        if (!element) return;

        html2canvas(element).then((canvas) => {
            const resizedCanvas = document.createElement('canvas')
            resizedCanvas.width = 600
            resizedCanvas.height = 480

            const ctx = resizedCanvas.getContext('2d')
            if (!ctx) return;
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 600, 480)

            const screenshot = resizedCanvas.toDataURL('image/png')

            const downloadLink = document.createElement('a')
            downloadLink.href = screenshot
            downloadLink.download = 'screenshot.png'

            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        })
    }
    return (
        <>
            <div className="flex sm:flex-row flex-col h-[calc(100vh-200px)] sm:flex-none">
                <div className="flex flex-col p-2 sm:w-1/2 w-full gap-2 relative sm:static">
                    {callAccepted ? (
                        <div className="relative min-h-[200px]">
                            <video
                                id="userVideo"
                                className="w-full sm:max-h-[23vh] sm:h-[25vh] min-h-[200px] sm:bg-black bg-black"
                                ref={userVideo}
                                autoPlay
                                playsInline
                            />
                            <button
                                className="absolute top-0 left-0 sm:right-0 sm:left-auto text-white z-20 bg-gray-100 sm:w-[35px] sm:h-[35px] w-full h-full sm:opacity-50 opacity-0 hover:opacity-25 transition-all duration-300"
                                onClick={() => takeScreenshot('userVideo')}
                            >
                                <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAADhklEQVR4nO2azU4UQRDHfyRED8pJD+KuBxWBhKfAj5OKih78SLwjeDDyIt4UfQAF14u6hisTXgE/DiqEoxhZveCyGdOxJulMFmZnpnfpma1f0snMznRPdaXr37U1A4qiKIqiKIqiKD6zCgQlPu865mErJT5XlJLTc83oMgeugUWnbPNRlARUA3NSNs0ISjYfRUlANTAnZdOMoGTzUZQEVANzUjbNCEo2H0VJQDUwJ2XTjKBk81GUBFQDC6QZA8A8sAmEKdum9O1rDZzJ4Lh4M2P0JceAn+KE+7IaO2VA+oQyhhmr0BpYBZaARoYVtJzD1uUMzzM21oBzdIm0mlEFtjKGXxOYyGHrhIyR5dnG5goesCQGvfXFoASMje/E5ld4QEOMKYLzIk6Jzb980MBQmquJzQEfgI/AH2nmuA7MimS4wKXduTQwdGCIWb3Pgd0OdXMBOOmrA3ttyJQlAzvAS+A2MAYckWaO78i1HWs3vXqAdjsjzGHIQ6Al/ReB0x30OQO8lj4tCXmvHNgrDZwSB5iwfWT9PriPLfa1x9K3lXEleqeBQYoPvStW2NrOuwX8Ba63seWmXJuOOdGMsQ0Mp3j+qo8hvJLiQ+8XVtjaXATWgfNtnmOubQAXYr/XZKxnKZ4f+OjANKnKrmwGkebdACY7HuG/E6/J8VkZq5kyFy2sBs7J/WZHNRySyX9PMca6hHOkiYsy5oMu2u1NHliX+01aEjG9R9jutwLNqo24J2Oav2idUtgQ/iL3jzi0YUzG/NQPDmzI/UM5XyHY/Yas5Lr0GtiIOTBryd3u55UDu62Bn+X+UdyHsCk6lD6E63tsImnSmEkr2e67TWTWQRqzIX3iacxMP2hgVSa/I4WBvGnMiG+JdC/qgQvSx1RV4o75uoczLwHf2oT6GxnraUobChvCSDE02o1NQQCrYNC0VpcdDdE1u5gwb5XmT9BHDkRKUFE5y3bi4X2iYTDmvKicdZn09EwDVxPO8xgyZxVUa1IYSGLECtuWbEpZ6JkGBgnneQ25IvW8qKRvdtS7wDhwVNq4pCpLUkSIwjbLynNltzNCB4YcB550+JK8KbW/YQ/sdkLo0JCK5HLvgTXgt7Q1SZJnHL5/9saB22KIq/e1hX+xnpaa9TeqCE6sygoPRVMPnFHgRwfa5VvbclyTzEVFPtSJwtnnti0rzxvnKYqiKIqiKIqi0JZ/NuhRNZnA3g4AAAAASUVORK5CYII="
                                    className="w-full h-full"
                                />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full bg-black min-h-[200px] flex justify-center items-center relative">
                            <svg
                                className="text-gray-300 animate-spin"
                                viewBox="0 0 64 64"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                            >
                                <path
                                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                    stroke="currentColor"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                                <path
                                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                    stroke="currentColor"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-900"
                                ></path>
                            </svg>
                        </div>
                    )}
                    <div className="absolute sm:static w-1/3 xs:w-1/4 sm:w-full top-3 right-3 z-100 sm:top-0 sm:right-0">
                        <div className="relative">
                            <video
                                className="w-full sm:max-h-[23vh] sm:h-[25vh] sm:bg-black bg-black"
                                id="myVideo"
                                ref={myVideo}
                                autoPlay
                                muted
                                playsInline
                            />
                            <button
                                className="absolute top-0 right-0 text-white z-20 bg-gray-100 sm:w-[35px] sm:h-[35px] w-full h-full sm:opacity-50 opacity-0 hover:opacity-25 transition-all duration-300"
                                onClick={() => takeScreenshot('myVideo')}
                            >
                                <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAADhklEQVR4nO2azU4UQRDHfyRED8pJD+KuBxWBhKfAj5OKih78SLwjeDDyIt4UfQAF14u6hisTXgE/DiqEoxhZveCyGdOxJulMFmZnpnfpma1f0snMznRPdaXr37U1A4qiKIqiKIqiKD6zCgQlPu865mErJT5XlJLTc83oMgeugUWnbPNRlARUA3NSNs0ISjYfRUlANTAnZdOMoGTzUZQEVANzUjbNCEo2H0VJQDUwJ2XTjKBk81GUBFQDC6QZA8A8sAmEKdum9O1rDZzJ4Lh4M2P0JceAn+KE+7IaO2VA+oQyhhmr0BpYBZaARoYVtJzD1uUMzzM21oBzdIm0mlEFtjKGXxOYyGHrhIyR5dnG5goesCQGvfXFoASMje/E5ld4QEOMKYLzIk6Jzb980MBQmquJzQEfgI/AH2nmuA7MimS4wKXduTQwdGCIWb3Pgd0OdXMBOOmrA3ttyJQlAzvAS+A2MAYckWaO78i1HWs3vXqAdjsjzGHIQ6Al/ReB0x30OQO8lj4tCXmvHNgrDZwSB5iwfWT9PriPLfa1x9K3lXEleqeBQYoPvStW2NrOuwX8Ba63seWmXJuOOdGMsQ0Mp3j+qo8hvJLiQ+8XVtjaXATWgfNtnmOubQAXYr/XZKxnKZ4f+OjANKnKrmwGkebdACY7HuG/E6/J8VkZq5kyFy2sBs7J/WZHNRySyX9PMca6hHOkiYsy5oMu2u1NHliX+01aEjG9R9jutwLNqo24J2Oav2idUtgQ/iL3jzi0YUzG/NQPDmzI/UM5XyHY/Yas5Lr0GtiIOTBryd3u55UDu62Bn+X+UdyHsCk6lD6E63tsImnSmEkr2e67TWTWQRqzIX3iacxMP2hgVSa/I4WBvGnMiG+JdC/qgQvSx1RV4o75uoczLwHf2oT6GxnraUobChvCSDE02o1NQQCrYNC0VpcdDdE1u5gwb5XmT9BHDkRKUFE5y3bi4X2iYTDmvKicdZn09EwDVxPO8xgyZxVUa1IYSGLECtuWbEpZ6JkGBgnneQ25IvW8qKRvdtS7wDhwVNq4pCpLUkSIwjbLynNltzNCB4YcB550+JK8KbW/YQ/sdkLo0JCK5HLvgTXgt7Q1SZJnHL5/9saB22KIq/e1hX+xnpaa9TeqCE6sygoPRVMPnFHgRwfa5VvbclyTzEVFPtSJwtnnti0rzxvnKYqiKIqiKIqi0JZ/NuhRNZnA3g4AAAAASUVORK5CYII="
                                    className="w-full h-full"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full justify-between relative sm:h-full h-[calc(100%-250px)]">
                    <Messages />
                    <div className="sm:static fixed w-full bottom-0">
                        <MessageInput />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Video;