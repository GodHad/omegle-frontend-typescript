import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Video from '../pages/Video';
import AdminDashboard from '../pages/AdminDashboard';

const PrivateRoute: React.FC = () => {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/" />;
};

const AdminRoute: React.FC = () => {
    const { user } = useAuth();
    return user && user.admin === true ? <Outlet /> : <Navigate to="/" />
}

const CustomRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route element={<PrivateRoute />}>
                <Route path='/chat' element={<Chat />} />
                <Route path='/video' element={<Video />} />
            </Route>
            <Route element={<AdminRoute />}>
                <Route path='/admin' element={<AdminDashboard />} />
            </Route>
        </Routes>
    )
}

export default CustomRoutes;