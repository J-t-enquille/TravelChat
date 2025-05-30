import { type FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { RJSFSchema } from "@rjsf/utils";
import FormDialog from "../tools/FormDialog.tsx";
import type { IconType } from "react-icons";
import { sendMessage } from "../../services/Socket.ts";
import { Context } from "../../services/Context.ts";
import { schemas, selectIcon } from "../../schemas";

type Extension = {
    name: string;
    icon: IconType;
    schema: RJSFSchema;
};

const sc = schemas as RJSFSchema[];

const extensions: Extension[] = sc.map((schema) => ({
    name: schema.title || "Untitled Schema",
    icon: selectIcon(schema.title),
    schema: schema,
}));

const SchemaSelection: FC = () => {
    const { user, setMessages } = useContext(Context);
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
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
                            gap: "10px",
                        }}
                    >
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
                </div>
            )}
            {selectedSchema !== undefined && (
                <FormDialog
                    title={"Preview answer Schema"}
                    schema={extensions[selectedSchema].schema}
                    onClose={hideDialog}
                    visible={dialogVisible}
                    onSubmit={(ev) => {
                        const msg = sendMessage(JSON.stringify(ev.formData), user);
                        if (msg) {
                            const titleMsg = {
                                ...msg,
                                text: `Sent a message using the ${extensions[selectedSchema].name} extension`,
                            };
                            setMessages((prev) => [...prev, titleMsg]);
                        }
                    }}
                    ask
                />
            )}
        </div>
    );
};

export default SchemaSelection;
