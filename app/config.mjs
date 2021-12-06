import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { config } from "dotenv";
import * as path from "path";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import createMemoryStore from "memorystore";

// Memory store
const MemoryStore = createMemoryStore(session);

// Load ENV
config();

// create app
const app = express();

// Server
export const server = https.createServer({
    key: fs.readFileSync("ssl/key.pem"),
    cert: fs.readFileSync('ssl/cert.pem')
}, app);

// Trust proxy
app.set('trust proxy', 1);

// Socket
export const socket = new Server(server);

// Use resources in public directory
app.use(express.static("public"));

// Use for GET and POST request
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({
    limit: '200mb',
    extended: true
}));
app.use(express.text({ limit: '200mb' }));

// cookie parser middleware
app.use(cookieParser());

// Static root
app.use(express.static(path.resolve()));

// Use session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        secure: true
    },
    resave: false,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    })
}));

// Execute when error detected
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Error Detected!');
});

// Export app
export default app;