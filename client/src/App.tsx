import "./App.css";
import { useState, useEffect } from "react";
import { socket } from "./services/Socket.ts";
import Layout from "./components/Layout.tsx";
import { Context } from "./services/Context.ts";

function App() {
    const [socketConnected, setSocketConnected] = useState(socket.connected);

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
        <Context.Provider value={{ socketConnected }}>
            <Layout />
        </Context.Provider>
    );
}

export default App;
