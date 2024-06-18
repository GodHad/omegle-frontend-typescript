import OmegleLogo from '../assets/Omegle2.png';

const Header: React.FC = () => {

    return (
        <div className="p-4 bg-white flex justify-between items-center max-h-[7vh]">
            <div className="flex items-center gap-12">
                <img src={OmegleLogo} alt="Omegle Logo" className="h-12" />
                <p className="text-2xl font-bold transform -rotate-2 sm:block hidden">Talk to strangers!</p>
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
            </div>
        </div>
    )
}


export default Header;