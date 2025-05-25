import { createContext } from "react";

export type UserType = {
    name: string;
    color: string;
};

export type ContextType = {
    socketConnected: boolean;
    user: UserType;
    setUser: (user: UserType) => void;
};

export const Context = createContext<ContextType>({
    socketConnected: false,
    user: { name: "", color: "" },
    setUser: () => {},
});
