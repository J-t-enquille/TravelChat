import "./App.css";
import { useState, useEffect } from "react";
import { socket } from "./services/Socket.ts";
import Layout from "./components/Layout.tsx";
import { Context } from "./services/Context.ts";

function App() {
    const [socketConnected, setSocketConnected] = useState(socket.connected);

    const [user, setUser] = useState<{ name: string; color: string }>({
        name: "",
        color: "#4874c5",
    });

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
    /*<div className="container">
        <div className="card">
            <div className="messages-list">
                {messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === socket.id;
                    return (
                        <div key={index} className="message-div">
                            <span className="message-user-name">{msg.senderName}</span>
                            <div
                                className="message-box"
                                style={{
                                    backgroundColor: isOwnMessage ? user.color : msg.senderColor,
                                    color: getContrastingColor(isOwnMessage ? user.color : msg.senderColor),
                                }}
                            >
                                {msg.text}
                            </div>
                            <span className="message-timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                        </div>
                    );
                })}
            </div>
            <div className="input-container">
                <div className="input-box">
                    <input
                        type="text"
                        className="text-input"
                        placeholder="Type your message..."
                        value={messageInput}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") sendMessage();
                        }}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button className="send-button" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
        <button onClick={() => socket.disconnect()}>Disconnect</button>
    </div>*/
    );
}

export default App;
