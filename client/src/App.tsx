import "./App.css";
import { useState, useEffect } from "react";
import { socket } from "./socket.ts";

function App() {
    const [messages, setMessages] = useState<Array<{ text: string; timestamp: Date }>>([]);
    const [messageInput, setMessageInput] = useState("");
    const [socketConnected, setSocketConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setSocketConnected(true);
            console.log("Socket connected", socket.id);
        }

        function onDisconnect() {
            setSocketConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });

        return () => {
            socket.off("message");
        };
    }, [messages]);

    const sendMessage = () => {
        if (messageInput.trim() !== "") {
            const message = { text: messageInput, timestamp: new Date() };
            socket.emit("message", message);
            setMessageInput("");
        }
    };

    if (!socketConnected) {
        return (
            <div className="container">
                <button onClick={() => socket.connect()}>Connect</button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <div className="messages-list">
                    {messages.map((msg, index) => (
                        <div key={index} className="message-div">
                            <div className="message-box">{msg.text}</div>
                            <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                    ))}
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
        </div>
    );
}

export default App;
