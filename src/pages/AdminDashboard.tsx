import axios from "axios";
import { useEffect, useState } from "react"
import { apiUrl } from "../utils/constant";
import { toast } from "react-toastify";
import { User } from "../types/user";
import PreviewModal from "../components/PreviewModal";


const AdminDashboard = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [realUserList, setRealUserList] = useState<User[]>([]);
    const [search, setSearch] = useState<string>('');
    const [isPreviewModal, setIsPreviewModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const getAllUsers = async () => {
        axios
            .get(`${apiUrl}/get_all_user`)
            .then((res) => {
                setRealUserList(res.data)
            })
            .catch((error) => {
                let message = error.response;
                if (!message) return toast.error("Server Error");
                message = message.data;
                if (!message) return toast.error("Server Error");
                message = message.message;
                if (!message) return toast.error("Server Error");
                toast.error(message);
            })
    }

    const handleCheckout = (e: React.ChangeEvent<HTMLInputElement>, ipAddress: string) => {
        const params = {
            ipAddress,
            status: e.target.checked
        }
        axios
            .post(`${apiUrl}/updateUserStatus`, params)
            .then((res) => {
                const tmpUserList = userList.map((item) => {
                    if (item.ipAddress === res.data.ipAddress) return res.data;
                    else return item;
                })
                setUserList(tmpUserList)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        if (!search) {
            setUserList(realUserList);
        } else {
            const temp = realUserList.filter((item) => item.country.toLowerCase().includes(search.toLowerCase()))
            setUserList(temp);
        }
    }, [realUserList, search])

    return (
        <div>
            <div className="py-3 px-4">
                <div className="relative max-w-xs">
                    <label className="sr-only">Search</label>
                    <input
                        type="text"
                        name="hs-table-with-pagination-search"
                        id="hs-table-with-pagination-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        placeholder="Search for items"
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                        <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-[#5ac8fa] text-slate-100">
                    <tr>
                        <th className="w-10"><input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" /></th>
                        <th className="w-20 px-6 py-3 text-start text-small font-large"></th>
                        <th className="w-10 px-6 py-3 text-start text-small font-large">Country</th>
                        <th className="w-10 px-6 py-3 text-start text-small font-large sm:table-cell hidden">State</th>
                        <th className="w-10 px-6 py-3 text-start text-small font-large md:table-cell hidden">City</th>
                        <th className="w-20 px-6 py-3 text-start text-small font-large sm:table-cell hidden">IP Address</th>
                        <th className="w-10 px-6 py-3 text-start text-small font-large lg:table-cell hidden">Machine info</th>
                        <th className="w-10 px-6 py-3 text-start text-small font-large">Baned</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:text-slate-200">
                    {
                        userList.length === 0
                            ? (<tr className="text-center"><td colSpan={6} className="text-[30px] p-10">There is no users</td></tr>)
                            : (
                                userList.map((one) => (
                                    <tr key={one.ipAddress} onClick={() => { setSelectedUser(one); setIsPreviewModal(true); }}>
                                        <td className="text-center"><input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" /></td>
                                        <td className="px-6 h-[120px] py-3 flex justify-center items-center">
                                            <img
                                                onError={(e) => { e.currentTarget.src = "/assets/images/default.png"; }}
                                                src={`/assets/images/${one.ipAddress}.png`}
                                                className="max-h-[50px] w-auto"
                                                alt="User"
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-start text-small font-large">{one.country}</td>
                                        <td className="px-6 py-3 text-start text-small font-large sm:table-cell hidden">{one.state}</td>
                                        <td className="px-6 py-3 text-start text-small font-large md:table-cell hidden">{one.city}</td>
                                        <td className="px-6 py-3 text-start text-small font-large sm:table-cell hidden">{one.ipAddress}</td>
                                        <td className="px-6 py-3 text-start text-small font-large lg:table-cell hidden">{one.last_login_machine_info}</td>
                                        <td className="px-6 py-3 text-start text-small font-large">
                                            <label className="flex items-center relative w-max cursor-pointer select-none">
                                                <input type="checkbox" checked={one.status} onChange={(e) => handleCheckout(e, one.ipAddress)} className="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full bg-red-500 checked:bg-green-500" />
                                                <span className="absolute font-medium text-xs right-3 text-white"> N </span>
                                                <span className="absolute font-medium text-xs right-9 text-white"> Y </span>
                                                <span className={`w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200 ${one.status ? "translate-x-[1.75rem]" : ""}`} />
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )
                    }
                </tbody>
            </table>
            {isPreviewModal && selectedUser && <PreviewModal user={selectedUser} setIsPreviewModal={(data: boolean) => setIsPreviewModal(data)} />}
        </div>
    )
}

export default AdminDashboard