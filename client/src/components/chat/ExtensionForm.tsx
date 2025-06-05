import { useContext, type FC, type FormEvent, useState } from "react";
import { Context } from "../../services/Context.ts";
import { sendMessage } from "../../services/Socket.ts";
import type { RJSFSchema } from "@rjsf/utils";

interface ExtensionFormProps {
    onClose: () => void;
    schema: RJSFSchema;
    initialQuestionText: string;
}

export const ExtensionForm: FC<ExtensionFormProps> = ({ onClose, schema, initialQuestionText }) => {
    const { user, setMessages } = useContext(Context);
    const [questionText, setQuestionText] = useState(initialQuestionText);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const stringSchema = JSON.stringify(schema);
        const msg = sendMessage(questionText, user, stringSchema);

        if (msg) {
            const messageWithSchema = {
                ...msg,
                text: questionText,
            };
            setMessages((prev) => [...prev, messageWithSchema]);
            onClose();
        }
        onClose();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: 8 }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                    type="text"
                    id="questionText"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    style={{ resize: "vertical", padding: 4 }}
                />
                <div style={{ height: 1, backgroundColor: "gray" }} />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};
