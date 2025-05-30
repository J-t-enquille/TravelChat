import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Message } from "./Validation.ts";

export type UserType = {
    name: string;
    color: string;
};

export type ContextType = {
    socketConnected: boolean;
    user: UserType;
    setUser: Dispatch<SetStateAction<UserType>>;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
    waitingForResponse: Message[];
    setWaitingForResponse: Dispatch<SetStateAction<Message[]>>;
};

export const Context = createContext<ContextType>({
    socketConnected: false,
    user: { name: "", color: "" },
    setUser: () => {},
    messages: [],
    setMessages: () => {},
    waitingForResponse: [],
    setWaitingForResponse: () => {},
});
