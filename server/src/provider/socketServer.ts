import { Server } from "socket.io";
import { server } from "./server";

export const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

export const setupSocketServer = () => {
    // Handle WebSocket connections here
    io.on("connection", (socket) => {
        console.log("A new user has connected", socket.id);

        // Listen for incoming messages from clients
        socket.on("message", (message) => {
            // Broadcast the message to all connected clients
            io.emit("message", message);
        });

        // Handle disconnections
        socket.on("disconnect", () => {
            console.log(socket.id, " disconnected");
        });
    });
};
