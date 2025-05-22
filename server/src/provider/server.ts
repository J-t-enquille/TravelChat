import { createServer } from "node:http";
import express from "express";

export const expressApp = express();

export const server = createServer(expressApp);
