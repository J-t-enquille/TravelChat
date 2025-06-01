import React, { useContext, useState } from "react";
import { Context } from "../../services/Context.ts";
import { sendMessage } from "../../services/Socket.ts";
import "./BinaryQuestion.css";

interface BinaryQuestionFormProps {
    onClose: () => void;
}

export const BinaryQuestionForm: React.FC<BinaryQuestionFormProps> = ({ onClose }) => {
    const { user, setMessages } = useContext(Context);
    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const binaryData = {
            binary: option1, // On envoie la première option comme valeur par défaut
            question,
            options: [option1, option2],
        };

        const msg = sendMessage(JSON.stringify(binaryData), user);
        if (msg) {
            const messageWithSchema = {
                ...msg,
                schema: "binaryQuestion",
            };
            setMessages((prev) => [...prev, messageWithSchema]);
            onClose();
        }
    };

    return (
        <div className="binary-question-form">
            <h3>Créer une question binaire</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="question">Question:</label>
                    <input
                        type="text"
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        placeholder="Entrez votre question"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="option1">Option 1:</label>
                    <input
                        type="text"
                        id="option1"
                        value={option1}
                        onChange={(e) => setOption1(e.target.value)}
                        required
                        placeholder="Première option"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="option2">Option 2:</label>
                    <input
                        type="text"
                        id="option2"
                        value={option2}
                        onChange={(e) => setOption2(e.target.value)}
                        required
                        placeholder="Deuxième option"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit">Envoyer</button>
                    <button type="button" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};
