import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';

import CustomRoutes from './routes';
import Header from './layout/Header';
import Socket from './Socket';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatContextProvider>
          <ToastContainer />
          <Socket />
          <Header />
          <CustomRoutes />
        </ChatContextProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
