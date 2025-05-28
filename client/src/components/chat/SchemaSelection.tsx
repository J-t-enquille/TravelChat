import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { FaWrench } from "react-icons/fa";
import type { RJSFSchema } from "@rjsf/utils";
import FormDialog from "../tools/FormDialog.tsx";
import type { IconType } from "react-icons";

type Extension = {
    name: string;
    icon: IconType;
    schema: RJSFSchema;
};

const exampleSchema: RJSFSchema = {
    title: "Example Schema",
    type: "object",
    required: ["task"],
    properties: {
        task: { type: "string", title: "Task", default: "Make a coffee for Lorenzo" },
        priority: {
            type: "string",
            title: "Priority",
            enum: ["low", "medium", "high"],
            default: "high",
            description: "Select the priority of the task",
        },
        done: { type: "boolean", title: "Done?", default: false },
    },
};

const exampleExtension: Extension = {
    name: "Example Extension",
    icon: FaWrench,
    schema: exampleSchema,
};

// Add more extensions here as needed following the same Extension structure type
const extensions: Extension[] = [exampleExtension];

const SchemaSelection: FC = () => {
    const [selectedSchema, setSelectedSchema] = useState<number | undefined>(undefined);

    const [selectionVisible, setSelectionVisible] = useState(false);
    const selectionPopUp = useRef<HTMLDivElement>(null);

    const showSelection = useCallback(() => setSelectionVisible(true), []);
    const hideSelection = useCallback(() => setSelectionVisible(false), []);

    const [dialogVisible, setDialogVisible] = useState(false);

    const showDialog = useCallback(() => {
        setDialogVisible(true);
        if (selectionVisible) hideSelection();
    }, [selectionVisible, hideSelection]);
    const hideDialog = useCallback(() => setDialogVisible(false), []);

    useEffect(() => {
        if (selectionPopUp.current && selectionVisible) selectionPopUp.current.focus();
    }, [selectionPopUp, selectionVisible]);

    return (
        <div>
            <button className={"schema-button"} onClick={!selectionVisible ? showSelection : hideSelection}>
                +
            </button>
            {selectionVisible && (
                <div
                    ref={selectionPopUp}
                    className={"schema-pop-up"}
                    tabIndex={0}
                    onBlur={() => null /*hideSelection*/}
                >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <h3 style={{ margin: 0 }}>Plugins</h3>
                    </div>
                    {extensions.map((ext, index) => {
                        return (
                            <button
                                key={index}
                                title={ext.name}
                                onClick={() => {
                                    setSelectedSchema(index);
                                    showDialog();
                                }}
                            >
                                {ext.icon({})}
                            </button>
                        );
                    })}
                </div>
            )}
            {selectedSchema !== undefined && (
                <FormDialog
                    schema={extensions[selectedSchema].schema}
                    onClose={hideDialog}
                    visible={dialogVisible}
                    log
                />
            )}
        </div>
    );
};

export default SchemaSelection;
