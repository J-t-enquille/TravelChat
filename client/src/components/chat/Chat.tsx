import { type FC, useContext, useEffect, useRef, useState } from "react";
import { sendMessage, socket } from "../../services/Socket.ts";
import { Context } from "../../services/Context.ts";
import SchemaSelection from "./SchemaSelection.tsx";
import Answer from "./Answer.tsx";
import type { RJSFSchema } from "@rjsf/utils";
import type { Message } from "../../services/Validation.ts";

const Chat: FC = () => {
    const { setMessages, messages } = useContext(Context);
    const [messageInput, setMessageInput] = useState("");
    const { user, waitingForResponse, setWaitingForResponse } = useContext(Context);

    const messageList = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("message", (message: Message) => {
            // Question asked
            if (message.schema) {
                const schema = JSON.parse(message.schema) as RJSFSchema;
                const isBinaryQuestion = schema.$id?.includes("binaryQuestion.json");
                const isMultipleChoice = schema.$id?.includes("multipleChoice.json");
                const isTravelPreferences = schema.$id?.includes("travelPreferences.json");
                const isActivityPreferences = schema.$id?.includes("activityPreferences.json");
                const isTransportPreferences = schema.$id?.includes("transportPreferences.json");

                if (!message.answer) {
                    setWaitingForResponse((prev) => [...prev, message]);
                    const combinedText = `${message.text}\nAwaiting answer... For ${schema.title}`;
                    setMessages((prev) => [
                        ...prev,
                        { ...message, text: combinedText, timestamp: Date.now().toString() },
                    ]);
                } else {
                    if (isBinaryQuestion) {
                        const msg = {
                            ...message,
                            text: `Answer to ${schema.title} is ${JSON.parse(message.text).binary}`,
                        };
                        setMessages((prev) => [...prev, msg]);
                    } else if (isMultipleChoice) {
                        const data = JSON.parse(message.text);
                        const text = `Answer to ${schema.title} is ${typeof data.options === "string" ? data.options : data.options.join(", ")}`;
                        const msg = {
                            ...message,
                            text,
                        };
                        setMessages((prev) => [...prev, msg]);
                    } else if (isTravelPreferences) {
                        const data = JSON.parse(message.text);
                        let travelPeriodText = "";

                        if (data.travel_period?.month && data.travel_period?.number_of_days) {
                            travelPeriodText = `${data.travel_period.number_of_days} days in ${data.travel_period.month}`;
                        } else if (data.travel_period?.start_date && data.travel_period?.end_date) {
                            travelPeriodText = `${data.travel_period.start_date} to ${data.travel_period.end_date}`;
                        }

                        const text = `Answer to ${schema.title} is: Destination: ${data.destination}, Travel Period: ${travelPeriodText}, Budget: ${data.budget}, Housing Type: ${data.housing_type}, Number of Rooms: ${data.number_of_rooms}, Number of Travelers: ${data.number_of_travelers}, Meal Plan: ${data.meal_plan}`;

                        const msg = { ...message, text };
                        setMessages((prev) => [...prev, msg]);
                    } else if (isActivityPreferences) {
                        const data = JSON.parse(message.text);
                        const text = `Answer to ${schema.title} is: Activity Type: ${data.activity_type}, Adult Only: ${data.adult_only ? "Yes" : "No"}, Duration: ${data.duration} days, Price: ${data.price}`;
                        const msg = { ...message, text };
                        setMessages((prev) => [...prev, msg]);
                    } else if (isTransportPreferences) {
                        const data = JSON.parse(message.text);
                        // optionnal : special_request
                        const text = `Answer to ${schema.title} is: Luggage assistance: ${data.luggage_assistance ? "Yes" : "No"}, Meal preference: ${data.meal_preference}, Seat preference: ${data.seat_preference}, Transportation: ${data.transportation} ${data.special_request ? `, Special request: ${data.special_request}` : ""}`;
                        const msg = { ...message, text };
                        setMessages((prev) => [...prev, msg]);
                    }
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
        if (!hex) {
            return "#000000";
        }
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
                                        color: getContrastingColor(
                                            isOwnMessage ? user.color : msg.senderColor || "#cccccc",
                                        ),
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
