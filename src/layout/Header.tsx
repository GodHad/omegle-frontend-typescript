import OmegleLogo from '../assets/Omegle2.png';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const { setDarkMode } = useAuth();
    return (
        <div className="p-4 flex justify-between items-center max-h-70px] border-b-2 border-slate-200">
            <div className="flex items-center gap-12">
                <img src={OmegleLogo} alt="Omegle Logo" className="h-12" />
                <p className="text-2xl font-bold transform -rotate-2 sm:block hidden text-slate-700 dark:text-slate-200">Talk to strangers!</p>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex gap-2">
                    {/* <button className="text-xs text-white bg-blue-600 border-none rounded flex gap-1 items-center"><FaFacebookF /> Share</button>
          <button className="text-xs text-white bg-blue-500 border-none rounded flex gap-1 items-center"><FaTwitter /> Tweet</button>
          <button className="p-1 border border-gray-400 rounded flex items-center gap-1"><FcGoogle /> Choose a language <FaSortDown /></button> */}
                </div>
                <div className="mt-1 flex gap-1 items-center">
                    {/* <p className="text-xl text-blue-400">{onlineUsers.length} +</p>
          <p className="text-blue-200">Live users</p> */}
                </div>
                <div className="flex flex-col justify-center ml-3">
                    <input type="checkbox" name="light-switch" className="light-switch sr-only" />
                    <label className="relative cursor-pointer p-2" htmlFor="light-switch">
                        <svg className="hidden dark:block" onClick={() => setDarkMode(false)} width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                            <path className="fill-slate-100" d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z" />
                            <path className="fill-slate-100" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
                        </svg>
                        <svg className="dark:hidden" onClick={() => setDarkMode(true)} width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                            <path className="fill-slate-700" d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z" />
                            <path className="fill-slate-800" d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z" />
                        </svg>
                        <span className="sr-only">Switch to light / dark version</span>
                    </label>
                </div>
            </div>
        </div>
    )
}


export default Header;