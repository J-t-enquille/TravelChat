import { server } from "./provider/server";
import { setupSocketServer } from "./provider/socketServer";

const { PORT = 5000 } = process.env;

setupSocketServer();
server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
