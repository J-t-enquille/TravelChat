import { type FC, useContext, useEffect, useRef, useState } from "react";
import { sendMessage, socket } from "../../services/Socket.ts";
import { Context } from "../../services/Context.ts";
import SchemaSelection from "./SchemaSelection.tsx";
import Answer from "./Answer.tsx";
import type { RJSFSchema } from "@rjsf/utils";

const Chat: FC = () => {
    const { setMessages, messages } = useContext(Context);
    const [messageInput, setMessageInput] = useState("");
    const { user, waitingForResponse, setWaitingForResponse } = useContext(Context);

    const messageList = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("message", (message) => {
            // Question asked
            if (message.schema) {
                const schema = JSON.parse(message.schema) as RJSFSchema;

                if (schema) {
                    setWaitingForResponse((prev) => [...prev, message]);
                    setMessages((prev) => [...prev, { ...message, text: `Awaiting answer... For ${schema.title}` }]);
                }
            } else {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off("message");
        };
    }, [setWaitingForResponse, setMessages]);

    useEffect(() => {
        if (messageList.current)
            messageList.current.scrollTo({ behavior: "smooth", top: messageList.current.scrollHeight });
    }, [messageList, messages]);

    const send = () => {
        const msg = sendMessage(messageInput, user);
        if (!msg) return;
        setMessages((prev) => [...prev, msg]);
        setMessageInput("");
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
                <div className={"header"}>
                    <h2>{user.name}</h2>
                    {waitingForResponse.length > 0 && <Answer />}
                </div>
                <div className="messages-list" ref={messageList}>
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
                                if (event.key === "Enter") send();
                            }}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <SchemaSelection />
                        <button className="send-button" onClick={send}>
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
