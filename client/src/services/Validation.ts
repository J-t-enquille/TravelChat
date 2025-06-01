import Ajv, { type JSONSchemaType, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

export type Message = {
    messageId: string;
    senderId: string;
    senderName: string;
    senderColor: string;
    timestamp: string;
    text: string;
    schema?: string;  // Maintenant explicitement optionnel
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
        schema: {
            type: "string",
            description: "Schema for custom questions",
            nullable: true
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

    // Fonction de test pour la validation des messages avec schéma binaire
    public testBinaryQuestion(binaryQuestion: any): boolean {
        const testMessage: Message = {
            messageId: "test-id",
            senderId: "test-sender",
            senderName: "Test User",
            senderColor: "#000000",
            timestamp: new Date().toISOString(),
            text: JSON.stringify(binaryQuestion),
            schema: "binaryQuestion"  // Identifie le type de schéma
        };

        return this.message(testMessage);
    }
}

const validate = new Validation();

export const validateMessage = validate.message;

// Export la fonction de test
export const testBinaryQuestion = (binaryQuestion: any) => validate.testBinaryQuestion(binaryQuestion);
