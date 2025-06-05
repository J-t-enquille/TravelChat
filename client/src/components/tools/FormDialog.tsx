import { type FC, useCallback, useEffect } from "react";
import type { RJSFSchema, RJSFValidationError, UiSchema } from "@rjsf/utils";
import Form from "@rjsf/core";
import Dialog from "./Dialog.tsx";
import type { IChangeEvent } from "@rjsf/core";
import { BinaryQuestionForm } from "../chat/BinaryQuestionForm.tsx";
import validator from "@rjsf/validator-ajv8";
import { MultipleChoiceForm } from "../chat/MultipleChoiceForm.tsx";
import { TravelPreferencesForm } from "../chat/TravelPreferencesForm.tsx";
import { ActivityPreferencesForm } from "../chat/ActivityPreferencesForm.tsx";
import { TransportPreferencesForm } from "../chat/TransportPreferencesForm.tsx";

type FormDialogProps = {
    title?: string;
    schema: RJSFSchema;
    visible: boolean;
    onClose: () => void;
    onDataChange?: (data: IChangeEvent<unknown, RJSFSchema>) => void;
    onSubmit?: (data: IChangeEvent<unknown, RJSFSchema>) => void;
    onError?: (errors: RJSFValidationError[]) => void;
    log?: boolean;
    ask?: boolean; // If it's a question or not
    schemaToSend?: RJSFSchema;
};

const FormDialog: FC<FormDialogProps> = ({
    visible,
    onClose,
    schema,
    onDataChange,
    onSubmit,
    onError,
    log,
    title,
    ask,
}) => {
    const isBinaryQuestion = schema.$id?.includes("binaryQuestion.json");
    const isMultipleChoice = schema.$id?.includes("multipleChoice.json");
    const isTravelPreferences = schema.$id?.includes("travelPreferences.json");
    const isActivityPreferences = schema.$id?.includes("activityPreferences.json");
    const isTransportPreferences = schema.$id?.includes("transportPreferences.json");

    // Reset the validator when the component is unmounted
    useEffect(() => {
        return validator.reset();
    }, []);

    const handleDataChange = useCallback(
        (data: IChangeEvent<unknown, RJSFSchema>) => {
            if (log) {
                console.log("Data changed:", data);
            }
            onDataChange?.(data);
        },
        [onDataChange, log],
    );

    const handleSubmit = useCallback(
        (data: IChangeEvent<unknown, RJSFSchema>) => {
            if (log) {
                console.log("Form submitted:", data);
            }
            onSubmit?.(data);
            onClose();
        },
        [onSubmit, log, onClose],
    );

    // Generate uiSchema from schema properties
    // If the schema has description, it will be used as the description in the uiSchema
    const uiSchema: UiSchema = {
        ...generateUiSchema(schema, ask),
        "ui:title": "",
        "ui:submitButtonOptions": { submitText: ask ? "Ask" : "Answer" },
        "ui:description": ask
            ? "Ask a question using the schema below. The answer will fit this form."
            : "Fill the form below.",
    };

    const handleError = useCallback(
        (errors: RJSFValidationError[]) => {
            if (log) {
                console.error("Validation errors:", errors);
            }
            onError?.(errors);
        },
        [onError, log],
    );

    return (
        <Dialog visible={visible} title={title ?? schema.title ?? "Add Title to you schema"} onClose={onClose}>
            {isBinaryQuestion && ask ? (
                <BinaryQuestionForm onClose={onClose} schema={schema} />
            ) : isMultipleChoice && ask ? (
                <MultipleChoiceForm onClose={onClose} schema={schema} />
            ) : isTravelPreferences && ask ? (
                <TravelPreferencesForm onClose={onClose} schema={schema} />
            ) : isActivityPreferences && ask ? (
                <ActivityPreferencesForm onClose={onClose} schema={schema} />
            ) : isTransportPreferences && ask ? (
                <TransportPreferencesForm onClose={onClose} schema={schema} />
            ) : (
                <>
                    <Form
                        schema={schema}
                        uiSchema={uiSchema}
                        validator={validator}
                        onChange={handleDataChange}
                        onSubmit={handleSubmit}
                        onError={handleError}
                    />
                </>
            )}
        </Dialog>
    );
};

export default FormDialog;

// recursive function to generate uiSchema from schema properties (focusing on description)
function generateUiSchema(schema: RJSFSchema, ask?: boolean): UiSchema {
    const uiSchema: UiSchema = {};

    for (const [key, value] of Object.entries(schema.properties || {})) {
        const val = JSON.parse(JSON.stringify(value));
        if (val.type === "object") {
            uiSchema[key] = generateUiSchema(val);
        } else {
            if (ask) {
                uiSchema[key] = {
                    ...uiSchema[key],
                    "ui:disabled": true, // Disable the field if it's a question
                    "ui:readonly": true, // Make it read-only
                };
            }
            if (val?.type === "string" && val?.enum) {
                if (val.enum.length === 2) {
                    uiSchema[key] = {
                        ...uiSchema[key],
                        "ui:widget": "RadioWidget",
                    };
                }
            } else if (val?.type === "array" && val?.items?.enum) {
                uiSchema[key] = {
                    ...uiSchema[key],
                    "ui:widget": "CheckboxesWidget",
                };
            }
        }
    }

    return uiSchema;
}
