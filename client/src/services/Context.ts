import { createContext } from "react";

export type ContextType = {
    socketConnected: boolean;
};

export const Context = createContext<ContextType>({ socketConnected: false });
