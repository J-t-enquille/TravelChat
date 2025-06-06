import { createServer } from "node:http";
import express from "express";

const { NODE_ENV } = process.env;

export const expressApp = express();

if (NODE_ENV === "production") {
    expressApp.use(express.static("client"));
} else {
    expressApp.get("/", (req, res) => {
        res.send("Static serve is only available in production mode");
    });
}

export const server = createServer(expressApp);
