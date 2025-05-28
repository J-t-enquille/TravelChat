import { type FC, useCallback } from "react";
import type { RJSFSchema, RJSFValidationError, UiSchema } from "@rjsf/utils";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import Dialog from "./Dialog.tsx";
import type { IChangeEvent } from "@rjsf/core";

type FormDialogProps = {
    schema: RJSFSchema;
    visible: boolean;
    onClose: () => void;
    onDataChange?: (data: IChangeEvent<unknown, RJSFSchema>) => void;
    onSubmit?: (data: IChangeEvent<unknown, RJSFSchema>) => void;
    onError?: (errors: RJSFValidationError[]) => void;
    log?: boolean;
};

const FormDialog: FC<FormDialogProps> = ({ visible, onClose, schema, onDataChange, onSubmit, onError, log }) => {
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
    const uiSchema: UiSchema = { ...generateUiSchema(schema), "ui:title": "" };

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
        <Dialog visible={visible} title={schema.title ?? "Add Title to you schema"} onClose={onClose}>
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
function generateUiSchema(schema: RJSFSchema): UiSchema {
    const uiSchema: UiSchema = {};

    for (const [key, value] of Object.entries(schema.properties || {})) {
        const val = JSON.parse(JSON.stringify(value));
        if (val.type === "object") {
            uiSchema[key] = generateUiSchema(val);
        } else {
            if (val?.description) {
                uiSchema[key] = {
                    "ui:description": val.description,
                };
            }
        }
    }

    return uiSchema;
}
