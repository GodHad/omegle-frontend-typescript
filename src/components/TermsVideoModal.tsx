import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { toast } from 'react-toastify';


interface Props {
    setIsTermsVideoModal: (value: boolean) => void;
}

const TermsVideoModal: React.FC<Props> = ({ setIsTermsVideoModal }) => {
    const [check1, setCheck1] = useState<boolean>(false);
    const [check2, setCheck2] = useState<boolean>(false);
    const [check3, setCheck3] = useState<boolean>(false);

    const { state, setState } = useChat();
    const navigate = useNavigate();

    const navigateToVideo = () => {
        setState({ ...state, chatType: 1 });
        navigate('/video');
    }

    const allowMediaDevice = () => {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            toast.info("Let's get this party started");
        }
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
            .then(function () {
                setState({ ...state, chatType: 1 });
                setCheck3(!check3);
            })
            .catch(function (err) {
                toast.error(err);
            });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center overflow-hidden">
            <div className="bg-white p-8 rounded-2xl w-5/6 sm:w-1/2">
                <div className="flex justify-end relative">
                    <button onClick={() => setIsTermsVideoModal(false)} className="text-gray-500 text-2xl absolute top-0 right-0">
                        <IoClose />
                    </button>
                </div>
                <div className="flex gap-2 mt-4 items-start">
                    <input type="checkbox" checked={check1} onChange={() => setCheck1(!check1)} className='mt-0.5' />
                    <span className="text-sm">
                        <strong>OUR AGE RESTRICTIONS HAVE CHANGED. YOU MUST BE 18 OR OLDER TO USE OMEGLE.</strong> Persons under the age of 18 <strong>may not</strong> use Omegle. See our updated <span className="text-blue-500 underline cursor-pointer">Terms of Service</span> for more info. <strong>By checking the box you acknowledge and represent that you comply with these age restrictions.</strong>
                    </span>
                </div>
                <div className="flex gap-2 mt-4 items-start">
                    <input type="checkbox" checked={check2} onChange={() => setCheck2(!check2)} className='mt-0.5' />
                    <span className="text-sm">
                        By checking the box you acknowledge that you have reviewed and agree to be bound by Omegle's <span className="text-blue-500 underline cursor-pointer">Terms of Service, Privacy Policy,</span> and <span className="text-blue-500 underline cursor-pointer">Community Guidelines.</span>
                    </span>
                </div>
                <div className="flex gap-2 mt-4 items-start">
                    <input type="checkbox" checked={check3} onChange={allowMediaDevice} className='mt-0.5' />
                    <span className="text-sm">Allow Video & Audio</span>
                </div>
                <div className="flex justify-end mt-5">
                    <button
                        onClick={navigateToVideo}
                        // disabled={!check1 || !check2 || !check3}
                        className={`text-2xl px-4 py-2 rounded-md ${check1 && check2 && check3 ? 'bg-blue-500 text-white' : 'bg-gray-300 cursor-not-allowed'}`}>
                        Confirm & continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TermsVideoModal;