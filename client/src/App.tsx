import "./style.css";
import { useState, useEffect } from "react";
import { socket } from "./socket.ts";
import Login from "./components/Login.tsx";
type Message = {
    text: string;
    timestamp: Date;
    senderId: string;
    senderName: string;
    senderColor: string;
};

function App() {
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [messageInput, setMessageInput] = useState("");
    const [socketConnected, setSocketConnected] = useState(socket.connected);

    const [user, setUser] = useState<{ name: string; color: string }>({
        name: "",
        color: "#4874c5",
    });

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
        if (!socket.id) {
            console.error("Socket ID is not available");
            return;
        }
        if (messageInput.trim() !== "") {
            const message: Message = {
                text: messageInput,
                timestamp: new Date(),
                senderId: socket.id,
                senderName: user.name,
                senderColor: user.color,
            };
            socket.emit("message", message);
            setMessageInput("");
        }
    };

    function getContrastingColor(hex: string): string {
        hex = hex.replace("#", "");

        // Convertit en valeurs RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Calcule la luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Retourne noir ou blanc selon la luminance
        return luminance > 0.5 ? "#000000" : "#ffffff";
    }

    if (!socketConnected) {
        return <Login user={user} setUser={setUser} />;
    }

    return (
        <div className="container">
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
        </div>
    );
}

export default App;
