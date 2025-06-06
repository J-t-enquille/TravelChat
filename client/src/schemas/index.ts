import { FaBeer, FaQuestion, FaCheckSquare } from "react-icons/fa";
import multipleChoice from "./multipleChoice.json";
import binaryQuestion from "./binaryQuestion.json";
import travelPreferences from "./travelPreferences.json";
import activityPreferences from "./activityPreferences.json";
import transportPreferences from "./transportPreferences.json";
import type { IconType } from "react-icons";
import type { Message } from "../services/Validation.ts";
import validator from "@rjsf/validator-ajv8";
import type { RJSFSchema } from "@rjsf/utils";
import { FaEarthAmericas, FaPlane } from "react-icons/fa6";
import { MdOutlineLocalActivity } from "react-icons/md";

export const schemas = [multipleChoice, binaryQuestion, travelPreferences, activityPreferences, transportPreferences];

/**
 * Selects an icon based on the schema name.
 * @param name
 */
export const selectIcon = (name?: string): IconType => {
    if (name?.replaceAll(" ", "") === "MultipleChoiceQuestion") {
        return FaCheckSquare;
    }
    if (name?.replaceAll(" ", "") === "BinaryQuestion") {
        return FaQuestion;
    }
    if (name?.replaceAll(" ", "") === "TravelPreferences") {
        return FaEarthAmericas;
    }
    if (name?.replaceAll(" ", "") === "ActivityPreferences") {
        return MdOutlineLocalActivity;
    }
    if (name?.replaceAll(" ", "") === "TransportPreferences") {
        return FaPlane;
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
