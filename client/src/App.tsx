import "./App.css";
import { useState, useEffect } from "react";
import { socket } from "./socket.ts";
import Ajv, { type JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import { v4 as uuidv4 } from "uuid";

const ajv = new Ajv();
addFormats(ajv);

interface MessageInterface {
    messageId: string;
    user: string;
    timestamp: string;
    text: string;
}

const messageSchema: JSONSchemaType<MessageInterface> = {
    $id: "https://polytech.fr/schema/core.schema.json",
    title: "Structured Message - Core Schema",
    description: "Base schema shared by all structured messages",
    type: "object",
    properties: {
        messageId: {
            type: "string",
            description: "Unique message identifier (UUID)",
        },
        user: {
            type: "string",
            description: "User who sent the message",
        },
        timestamp: {
            type: "string",
            format: "date-time",
            description: "Date and time the message was sent",
        },
        text: {
            type: "string",
            description: "Free-text content of the message",
        },
    },
    required: ["messageId", "user", "text", "timestamp"],
};

const validate = ajv.compile(messageSchema);
const currentUser = "Alice";

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
            const message = {
                messageId: uuidv4(),
                user: currentUser,
                text: messageInput,
                timestamp: new Date().toISOString(),
            };
            const valid = validate(message);
            if (!valid && validate.errors) {
                console.error("Validation errors", validate.errors);
                const missingFields = validate.errors
                    .filter((err) => err.keyword === "required")
                    .map((err) => (err.params as any).missingProperty);

                alert("Invalid message, missing fields : " + missingFields);
                return;
            }
            console.log("message", message);
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
