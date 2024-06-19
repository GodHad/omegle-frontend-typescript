import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';

import CustomRoutes from './routes';
import Header from './layout/Header';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatContextProvider>
          <ToastContainer />
          <Header />
          <SocketProvider>
            <CustomRoutes />
          </SocketProvider>
        </ChatContextProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
