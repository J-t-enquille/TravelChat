import { type FC, useContext } from "react";
import Chat from "./chat/Chat";
import { socket } from "../services/Socket.ts";
import { Context } from "../services/Context.ts";

const Layout: FC = () => {
    const { socketConnected } = useContext(Context);

    if (!socketConnected) {
        return (
            <div className="container">
                <button onClick={() => socket.connect()}>Connect</button>
            </div>
        );
    }

    return (
        <div className="container">
            <Chat />
        </div>
    );
};
export default Layout;
