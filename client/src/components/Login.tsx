import { useState } from "react";
import { socket } from "../services/Socket.ts";

type LoginProps = {
    user: { name: string; color: string };
    setUser: (user: { name: string; color: string }) => void;
};

function Login({ user, setUser }: LoginProps) {
    const [error, setError] = useState("");
    const handleConnect = () => {
        if (user.name.trim() === "") {
            setError("Please enter a name");
        } else {
            setError("");
            //socket.auth = { user }; //if you want to send the user data to the server
            socket.connect();
        }
    };

    return (
        <div className="container">
            <div className="login-group">
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={user.name}
                        className="text-input"
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                    {error && <div className={"error"}>{error}</div>}
                </div>
                <div className={"color-input"}>
                    <label>Choose your color</label>
                    <input
                        type="color"
                        value={user.color}
                        onChange={(e) => setUser({ ...user, color: e.target.value })}
                        style={{ marginLeft: "0.5em" }}
                    />
                </div>
            </div>
            <button onClick={handleConnect}>Connect</button>
        </div>
    );
}

export default Login;
