import "./style.css";
import { useState, useEffect } from "react";
import { socket } from "./services/Socket.ts";
import Layout from "./components/Layout.tsx";
import { Context, type UserType } from "./services/Context.ts";
import type { Message } from "./services/Validation.ts";

function App() {
    const [socketConnected, setSocketConnected] = useState(socket.connected);
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [user, setUser] = useState<UserType>({
        name: "",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });
    const [waitingForResponse, setWaitingForResponse] = useState<Array<Message>>([]);

    useEffect(() => {
        const onConnect = () => setSocketConnected(true);
        const onDisconnect = () => setSocketConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return (
        <Context.Provider
            value={{ socketConnected, user, setUser, messages, setMessages, waitingForResponse, setWaitingForResponse }}
        >
            <Layout />
        </Context.Provider>
    );
}

export default App;
