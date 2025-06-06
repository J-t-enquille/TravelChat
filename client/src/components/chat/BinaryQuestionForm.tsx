import React, { type FC, useContext, useEffect, useState } from "react";
import { Context } from "../../services/Context.ts";
import { sendMessage } from "../../services/Socket.ts";
import "../tools/forms.css";
import type { RJSFSchema } from "@rjsf/utils";
import { MultipleChoice } from "../tools/MultipleChoice.tsx";

interface BinaryQuestionFormProps {
    onClose: () => void;
    schema: RJSFSchema;
}

export const BinaryQuestionForm: FC<BinaryQuestionFormProps> = ({ onClose, schema }) => {
    const { user, setMessages } = useContext(Context);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [stringSchema, setStringSchema] = useState<string>(
        JSON.stringify(schema).replaceAll(/\n/g, "").replaceAll(" ", ""),
    );

    useEffect(() => {
        console.log(stringSchema);
    }, [stringSchema]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const msg = sendMessage(question, user, stringSchema);
        if (msg) {
            const messageWithSchema = {
                ...msg,
                text: `${question} ${options.join(" / ")}`,
            };
            setMessages((prev) => [...prev, messageWithSchema]);
            onClose();
        }
    };

    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: 8 }}>
            <h3 style={{ margin: 4, marginLeft: 0, fontSize: 20 }}>Create Binary Question</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                <MultipleChoice
                    binary
                    initQuestion="BINARY_QUESTION"
                    initAnswerType={"string"}
                    setParentQuestion={setQuestion}
                    setParentOptions={setOptions}
                    setStringSchema={setStringSchema}
                />
                <div style={{ height: 1, margin: 8, backgroundColor: "gray" }} />
                <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", gap: 8 }}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};
