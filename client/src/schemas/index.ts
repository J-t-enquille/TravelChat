import { FaBeer, FaPastafarianism, FaWrench, FaQuestion } from "react-icons/fa";
import exampleSchema from "./exampleSchema.json";
import exampleSchema2 from "./exampleSchema2.json";
import binaryQuestion from "./binaryQuestion.json";
import type { IconType } from "react-icons";
import type { Message } from "../services/Validation.ts";
import validator from "@rjsf/validator-ajv8";
import type { RJSFSchema } from "@rjsf/utils";

export const schemas = [exampleSchema, exampleSchema2, binaryQuestion];

/**
 * Selects an icon based on the schema name.
 * @param name
 */
export const selectIcon = (name?: string): IconType => {
    if (name === "Example Schema") {
        return FaWrench;
    }
    if (name === "Example Schema 2") {
        return FaPastafarianism;
    }
    if (name === "Binary Question Schema") {
        return FaQuestion;
    }
    return FaBeer;
};

/**
 * Identifies the schema of a message. If the schema is not identified, it calls the unidentified callback if provided.
 * @param message
 * @param unidentifiedCb
 */
export const identifyMessageSchema = (message: Message, unidentifiedCb?: (message: string) => void) => {
    try {
        for (const schema of schemas) {
            if (
                validator.isValid(
                    schema as RJSFSchema,
                    JSON.parse(message.text),
                    schema as RJSFSchema /*TODO : replace with root schema*/,
                )
            ) {
                return schema;
            }
        }
    } catch (_error) {
        if (unidentifiedCb) unidentifiedCb(message.text);
        return undefined;
    }
    if (unidentifiedCb) unidentifiedCb(message.text);
    return undefined;
};
