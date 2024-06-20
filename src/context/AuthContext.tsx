import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/user";

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    setDarkMode: (darkMode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user);
    }

    const setDarkMode = (darkMode: boolean) => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }

    return (
        <AuthContext.Provider value={{ user, login, setDarkMode }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}