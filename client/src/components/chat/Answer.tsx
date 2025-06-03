import { type FC, useCallback, useContext, useState } from "react";
import { Context } from "../../services/Context.ts";
import { selectIcon } from "../../schemas";
import type { RJSFSchema } from "@rjsf/utils";
import FormDialog from "../tools/FormDialog.tsx";
import { sendMessage } from "../../services/Socket.ts";

const AnswerButton: FC = () => {
    const [answerSelectVisible, setAnswerSelectVisible] = useState(false);
    const [answerSchema, setAnswerSchema] = useState<RJSFSchema>();
    const [answerTo, setAnswerTo] = useState<number>();
    const { waitingForResponse, setWaitingForResponse } = useContext(Context);

    const [dialogVisible, setDialogVisible] = useState(false);

    const showDialog = useCallback(() => {
        setDialogVisible(true);
        if (answerSelectVisible) setAnswerSelectVisible(false);
    }, [answerSelectVisible, setAnswerSelectVisible]);
    const hideDialog = useCallback(() => setDialogVisible(false), []);

    const { setMessages, user } = useContext(Context);

    return (
        <>
            <button className={"awaiting-answer"} onClick={() => setAnswerSelectVisible(!answerSelectVisible)}>
                Answer
            </button>
            {answerSelectVisible && (
                <div className={"answer-pop-up"}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <h3 style={{ margin: 0 }}>Awaiting Answer</h3>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
                            gap: "10px",
                        }}
                    >
                        {waitingForResponse.map((message, index) => {
                            const schema = JSON.parse(message.schema!) as RJSFSchema;
                            return (
                                <button
                                    key={index}
                                    title={schema?.title}
                                    onClick={() => {
                                        setAnswerSelectVisible(false);
                                        showDialog();
                                        setAnswerTo(index);
                                        setAnswerSchema(schema as RJSFSchema);
                                    }}
                                >
                                    {selectIcon(schema?.title)({})}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            {answerSchema !== undefined && (
                <FormDialog
                    schema={answerSchema}
                    onClose={hideDialog}
                    visible={dialogVisible}
                    onSubmit={(ev) => {
                        const text = `Here is my answer to your question:\n` + JSON.stringify(ev.formData);
                        const msg = sendMessage(text, user);
                        const message = waitingForResponse[answerTo!];
                        if (msg) {
                            const localMsg = {
                                ...msg,
                                text: `Answer to ${message?.senderName}:  ${JSON.stringify(ev.formData)}`,
                            };
                            setMessages((prev) => [...prev, localMsg]);
                            if (answerTo !== undefined)
                                setWaitingForResponse((prev) => [
                                    ...prev.slice(0, answerTo),
                                    ...prev.slice(answerTo + 1),
                                ]);
                        }
                    }}
                    log
                />
            )}
        </>
    );
};

export default AnswerButton;
