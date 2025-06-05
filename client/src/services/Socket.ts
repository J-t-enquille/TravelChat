import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { type Message, validateMessage } from "./Validation.ts";
import type { UserType } from "./Context.ts";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:5000";

export const socket = io(URL, { autoConnect: false });

export const sendMessage = (text: string, user: UserType, schema?: string, answer?: boolean) => {
    if (!socket.id) {
        console.error("Socket ID is not available");
        return;
    }
    if (text.trim() !== "") {
        const message: Message = {
            messageId: uuidv4(),
            text,
            timestamp: new Date().toISOString(),
            senderId: socket.id,
            senderName: user.name,
            senderColor: user.color,
            schema,
            answer,
        };
        const valid = validateMessage(message);
        if (!valid && validateMessage.errors) {
            console.error("Validation errors", validateMessage.errors);
            const errorFields = validateMessage.errors.map((err) => err.instancePath);

            alert("Invalid message, errors in fields : " + errorFields);
            return;
        }
        socket.emit("message", message);

        return message;
    }
    return;
};
