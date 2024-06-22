import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';
import * as process from 'process';

import CustomRoutes from './routes';
import Header from './layout/Header';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-carousel/lib/styles/carousel.css'
import { SocketProvider } from './context/SocketContext';

window.global = window;
window.process = process;

function App() {
  return (
    <BrowserRouter>
      <div className='dark:bg-slate-700 bg-slate-100 flex flex-col h-fit min-h-screen'>
        <AuthProvider>
          <ChatContextProvider>
            <ToastContainer />
            <Header />
            <SocketProvider>
              <CustomRoutes />
            </SocketProvider>
          </ChatContextProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  )
}

export default App
