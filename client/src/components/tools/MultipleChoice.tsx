import { type Dispatch, type FC, type SetStateAction, useEffect, useState } from "react";

type AnswerType = "array" | "string";

type MultipleChoiceProps = {
    binary?: boolean;
    initQuestion: string;
    initAnswerType: AnswerType;
    setStringSchema: Dispatch<SetStateAction<string>>;
    setParentQuestion?: Dispatch<SetStateAction<string>>;
    setParentOptions?: Dispatch<SetStateAction<string[]>>;
};

export const MultipleChoice: FC<MultipleChoiceProps> = ({
    binary,
    initQuestion,
    initAnswerType,
    setStringSchema,
    setParentQuestion,
    setParentOptions,
}) => {
    const [prevQuestion, setPrevQuestion] = useState(initQuestion ?? "");
    const [question, setQuestion] = useState(initQuestion ?? "");
    const [options, setOptions] = useState<string[]>(binary ? ["", ""] : [""]);
    const [prevAnswerType, setPrevAnswerType] = useState<AnswerType>(initAnswerType);
    const [answerType, setAnswerType] = useState<AnswerType>(initAnswerType);

    useEffect(() => {
        const escapedQuestion = prevQuestion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (answerType === "string" && answerType !== prevAnswerType) {
            setStringSchema((prev) => {
                const re = RegExp(
                    `"type":"${prevAnswerType}","title":"${escapedQuestion}","uniqueItems":true,"items":{"enum".*]}`,
                    "g",
                );
                return prev.replace(
                    re,
                    `"type":"${answerType}","title":"${question}","enum":${JSON.stringify(options).replaceAll(/\n/g, "").replaceAll(" ", "")},"default":"${options[0]}"`,
                );
            });
        } else if (answerType === "array" && answerType !== prevAnswerType) {
            setStringSchema((prev) => {
                const re = RegExp(
                    `"type":"${prevAnswerType}","title":"${escapedQuestion}","enum".*],"default":".*"`,
                    "g",
                );
                return prev.replace(
                    re,
                    `"type":"${answerType}","title":"${question}","uniqueItems":true,"items":{"enum":${JSON.stringify(options).replaceAll(/\n/g, "").replaceAll(" ", "")}}`,
                );
            });
        } else if (answerType === "string" && answerType === prevAnswerType) {
            setStringSchema((prev) => {
                const re = RegExp(`"type":"${answerType}","title":"${escapedQuestion}","enum":.*],"default":".*"`, "g");
                return prev.replace(
                    re,
                    `"type":"${answerType}","title":"${question}","enum":${JSON.stringify(options).replaceAll(/\n/g, "").replaceAll(" ", "")},"default":"${options[0]}"`,
                );
            });
        } else {
            setStringSchema((prev) => {
                const re = RegExp(
                    `"type":"${answerType}","title":"${escapedQuestion}","uniqueItems":true,"items":{"enum":.*]}`,
                    "g",
                );
                return prev.replace(
                    re,
                    `"type":"${answerType}","title":"${question}","uniqueItems":true,"items":{"enum":${JSON.stringify(options).replaceAll(/\n/g, "").replaceAll(" ", "")}}`,
                );
            });
        }

        setPrevQuestion(question);
        setPrevAnswerType(answerType);
        if (setParentQuestion) setParentQuestion(question ?? "");
        if (setParentOptions) setParentOptions(options);
    }, [options, question, answerType]);

    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                <label htmlFor="question" style={{ fontSize: 18, fontWeight: "bold" }}>
                    Question:
                </label>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    placeholder="Entrez votre question"
                    style={{ flex: 1, padding: 8 }}
                />
            </div>
            {!binary && (
                <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
                    <label htmlFor="answerType" style={{ fontSize: 14, fontStyle: "italic" }}>
                        Unique Answer
                    </label>

                    <input
                        type={"checkbox"}
                        checked={answerType === "string"}
                        onChange={() => setAnswerType((prev) => (prev === "string" ? "array" : "string"))}
                    />
                </div>
            )}

            <label htmlFor={"options"} style={{ fontSize: 18, fontWeight: "bold" }}>
                Options:
            </label>
            {options.map((option, index) => (
                <div id="options" key={index} style={{ display: "flex", flex: 1 }}>
                    <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                        }}
                        required
                        placeholder={`Option ${index + 1}`}
                        style={{ flex: 1, marginRight: binary ? 0 : 8, padding: 8 }}
                    />
                    {!binary && (
                        <button
                            disabled={options.length <= 1}
                            onClick={() => {
                                if (options.length <= 1) return;
                                setOptions((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
                            }}
                        >
                            -
                        </button>
                    )}
                </div>
            ))}
            {!binary && (
                <button type="button" onClick={() => setOptions([...options, ""])} disabled={options.length >= 5}>
                    Add Option
                </button>
            )}
        </div>
    );
};
