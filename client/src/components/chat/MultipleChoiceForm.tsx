import type { RJSFSchema } from "@rjsf/utils";
import { type FC, type FormEvent, useContext, useEffect, useState } from "react";
import { sendMessage } from "../../services/Socket.ts";
import { Context } from "../../services/Context.ts";
import { MultipleChoice } from "../tools/MultipleChoice.tsx";

type MultipleChoiceProps = {
    onClose: () => void;
    schema: RJSFSchema;
};

export const MultipleChoiceForm: FC<MultipleChoiceProps> = ({ onClose, schema }) => {
    const { user, setMessages } = useContext(Context);
    const [question, setQuestion] = useState<string>("MULTIPLE_CHOICE_QUESTION");
    const [options, setOptions] = useState<string[]>([""]);

    const [stringSchema, setStringSchema] = useState<string>(
        JSON.stringify(schema).replaceAll(/\n/g, "").replaceAll(" ", ""),
    );

    useEffect(() => {
        console.log(stringSchema);
    }, [stringSchema]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const msg = sendMessage("useless", user, stringSchema);
        if (msg) {
            const messageWithSchema = {
                ...msg,
                text: `${question} ${options.join(" / ")}`,
            };
            setMessages((prev) => [...prev, messageWithSchema]);
            onClose();
        }

        onClose();
    };

    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: 8 }}>
            <h3 style={{ margin: 4, marginLeft: 0, fontSize: 20 }}>Create multiple choice question</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                <MultipleChoice
                    initQuestion={"MULTIPLE_CHOICE_QUESTION"}
                    initAnswerType={"string"}
                    setStringSchema={setStringSchema}
                    setParentQuestion={setQuestion}
                    setParentOptions={setOptions}
                />
                <div style={{ height: 1, margin: 8, backgroundColor: "gray" }} />
                <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", gap: 8 }}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};
