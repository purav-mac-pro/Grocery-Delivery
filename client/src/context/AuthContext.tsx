
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import toast from "react-hot-toast";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load saved authentication data when the app starts
    useEffect(() => {
        const savedToken = localStorage.getItem("auth_token");
        const savedUser = localStorage.getItem("auth_user");

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Failed to parse saved user:", error);

                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");
            }
        }

        setLoading(false);
    }, []);

    // Login
    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });

            setUser(data.user);
            setToken(data.token);

            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.user));

            toast.success("Login successful");

            navigate("/");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Login failed"
            );
        }
    };

    // Register
    const register = async (
        name: string,
        email: string,
        password: string
    ) => {
        try {
            const { data } = await api.post("/auth/register", {
                name,
                email,
                password,
            });

            setUser(data.user);
            setToken(data.token);

            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.user));

            toast.success("Registration successful");

            navigate("/");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Registration failed"
            );
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");

        toast.success("Logged out successfully");

        navigate("/login");
    };

    // Update user
    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = {
                ...user,
                ...userData,
            };

            setUser(updatedUser);

            localStorage.setItem(
                "auth_user",
                JSON.stringify(updatedUser)
            );
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom auth hook
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return context;
}
