import Ajv, { type JSONSchemaType, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

export type Message = {
    messageId: string;
    senderId: string;
    senderName: string;
    senderColor: string;
    timestamp: string;
    text: string;
};

const messageSchema: JSONSchemaType<Message> = {
    $id: "https://polytech.fr/schema/core.schema.json",
    title: "Structured Message - Core Schema",
    description: "Base schema shared by all structured messages",
    type: "object",
    properties: {
        messageId: {
            type: "string",
            description: "Unique message identifier (UUID)",
        },
        senderId: {
            type: "string",
            description: "Id of user who sent the message",
        },
        senderName: {
            type: "string",
            description: "Name of user who sent the message",
        },
        senderColor: {
            type: "string",
            description: "Color associated with the user who sent the message",
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
    required: ["messageId", "senderId", "senderName", "senderColor", "text", "timestamp"],
};

/**
 * Validation class used to validate objects using ajv unique instance.
 */
export class Validation {
    public message: ValidateFunction<Message>;

    constructor() {
        const ajv = new Ajv({ allErrors: true });
        addFormats(ajv);

        // Compile all schemas here
        this.message = ajv.compile<Message>(messageSchema);
    }
}

const validate = new Validation();

export const validateMessage = validate.message;
