import { type FC, useCallback } from "react";
import type { RJSFSchema, RJSFValidationError, UiSchema } from "@rjsf/utils";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import Dialog from "./Dialog.tsx";
import type { IChangeEvent } from "@rjsf/core";

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
            <Form
                schema={schema}
                uiSchema={uiSchema}
                validator={validator}
                onChange={handleDataChange}
                onSubmit={handleSubmit}
                onError={handleError}
            />
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
            if (val?.description) {
                uiSchema[key] = {
                    ...uiSchema[key],
                    "ui:description": val.description,
                };
            }
        }
    }

    return uiSchema;
}
