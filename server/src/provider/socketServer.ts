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
            const clientsCount = io.sockets.sockets.size;
            if (clientsCount < 2) {
                socket.emit("message", {
                    senderId: "server",
                    senderName: "Server",
                    text: "At least two people must be connected to send a message.",
                    timestamp: Date.now(),
                });
                return;
            }
            // Broadcast the message to all connected clients except the sender
            io.except(socket.id).emit("message", message);
        });

        // Handle disconnections
        socket.on("disconnect", () => {
            console.log(socket.id, " disconnected");
        });
    });
};
