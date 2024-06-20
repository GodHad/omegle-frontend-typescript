import { IoClose } from 'react-icons/io5';
import { User } from '../types/user';

interface Props {
    setIsPreviewModal: (value: boolean) => void;
    user: User;
}

const PreviewModal: React.FC<Props> = ({ setIsPreviewModal, user }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-40 flex justify-center items-center overflow-hidden">
            <div className="bg-slate-100 p-8 rounded-2xl w-5/6 sm:w-1/2 dark:bg-slate-700 dark:text-slate-200">
                <div className="flex justify-end">
                    <button onClick={() => setIsPreviewModal(false)} className="text-slate-300 text-2xl">
                        <IoClose />
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="py-10 px-0 flex justify-center">
                        <img onError={(e) => { e.currentTarget.src = "/assets/images/default.png"; }} src={`/assets/images/${user.ipAddress}.png`} alt={user.ipAddress} />
                    </div>
                    <div className='flex flex-row text-lg'>
                        <div className='w-1/2 font-bold'>
                            <p>Location: </p>
                        </div>
                        <div className='w-1/2'>
                            <p>{user.city + " " + user.state + ", " + user.country}</p>
                        </div>
                    </div>
                    <div className='flex flex-row text-lg'>
                        <div className='w-1/2 font-bold'>
                            <p>IPaddress: </p>
                        </div>
                        <div className='w-1/2'>
                            <p>{user.ipAddress}</p>
                        </div>
                    </div>
                    <div className='flex flex-row text-lg'>
                        <div className='w-1/2 font-bold'>
                            <p>Machine Info: </p>
                        </div>
                        <div className='w-1/2'>
                            <p>{user.last_login_machine_info}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewModal;