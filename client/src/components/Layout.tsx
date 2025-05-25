import { type FC, useContext } from "react";
import Chat from "./chat/Chat";
import { Context } from "../services/Context.ts";
import Login from "./Login.tsx";

const Layout: FC = () => {
    const { socketConnected, user, setUser } = useContext(Context);

    if (!socketConnected) {
        return (
            <div className="container">
                <Login user={user} setUser={setUser} />
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
