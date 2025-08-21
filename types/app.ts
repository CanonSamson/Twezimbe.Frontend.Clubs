import { User } from "@/api/signin"

export type AppContextProps = {
    currentUser: User | undefined;
    isLoading: boolean;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    handleGetUser: () => Promise<User | undefined>
    logout: () => Promise<void>
    loggingOut: boolean
}