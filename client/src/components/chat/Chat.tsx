import { type FC, useContext, useEffect, useState } from "react";
import { socket } from "../../services/Socket.ts";
import { Context } from "../../services/Context.ts";
import { v4 as uuidv4 } from "uuid";
import { type Message, validateMessage } from "../../services/Validation.ts";

const Chat: FC = () => {
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [messageInput, setMessageInput] = useState("");
    const { user } = useContext(Context);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (!socket.id) {
            console.error("Socket ID is not available");
            return;
        }
        if (messageInput.trim() !== "") {
            const message = {
                messageId: uuidv4(),
                text: messageInput,
                timestamp: new Date().toISOString(),
                senderId: socket.id,
                senderName: user.name,
                senderColor: user.color,
            };
            const valid = validateMessage(message);
            if (!valid && validateMessage.errors) {
                console.error("Validation errors", validateMessage.errors);
                const errorFields = validateMessage.errors.map((err) => err.instancePath);

                alert("Invalid message, errors in fields : " + errorFields);
                return;
            }
            socket.emit("message", message);
            setMessageInput("");
        }
    };

    function getContrastingColor(hex: string): string {
        hex = hex.replace("#", "");

        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? "#000000" : "#ffffff";
    }

    return (
        <div className="container">
            <div className="card">
                <div className="messages-list">
                    {messages.map((msg) => {
                        const isOwnMessage = msg.senderId === socket.id;

                        return (
                            <div key={msg.timestamp.toString()} className="message-div">
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
};

export default Chat;
