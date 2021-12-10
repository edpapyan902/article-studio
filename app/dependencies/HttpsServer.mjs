const httpsEvent = [
    "listening", "close", "checkContinue", "checkExpectation",
    "clientError", "connect", "connection", "request", "upgrade",
    'keylog', 'newSession', 'OCSPRequest', 'resumeSession',
    'secureConnection', 'tlsClientError', 'error'
];

/**
 * Asynchronous HTTPS Node.js Implementation
 * @example
 * import https from "https";
 * import fs from "fs";
 * import express from "express";
 * import HttpsServer from "HttpsServer.mjs";
 * 
 * // Express server
 * const app = express();
 * 
 * app.get("/", (_, res) => res.end("Hello World"));
 * 
 * // Target HTTPS Server
 * const target = https.createServer({
 *     key: fs.readFileSync("ssl/key.pem"),
 *     cert: fs.readFileSync('ssl/cert.pem')
 * }, app);
 * 
 * // HTTPS async server
 * const server = new HttpsServer(target);
 * 
 * // Run right after the server is started
 * server.onListening(() => console.log("Server is running"));
 * 
 * // Start the server
 * await server.start(443, "0.0.0.0");
 */

export default class HttpsServer {
    #httpsServer;
    timeout;
    port;
    hostname;

    /**
     * @param {import("https").Server} server 
     * 
     * Constructor
     */
    constructor(server) {
        this.#httpsServer = server;
        this.timeout = this.port = this.hostname = null;
        for (const ev of httpsEvent) {
            /**
             * @param {(...args: any[]) => void} listener 
             * @returns {HttpsServer}
             */
            this["on" + ev.charAt(0).toUpperCase() + ev.slice(1)] = listener =>
                new HttpsServer(this.server.on(ev, listener))
        }
    }

    /**
     * @type {import("https").Server}
     * 
     * get the https server
     */
    get server() {
        return this.#httpsServer;
    }

    /**
     * @param {number} port 
     * @param {string} hostname 
     * @returns {Promise<HttpsServer>} the current server
     * 
     * Start the server
     */
    start =
        async (port = 443, hostname = "0.0.0.0") =>
            new Promise((res, rej) => {
                try {
                    if (this.timeout)
                        this.onTimeout();
                    if (this.server.listening)
                        rej("Server is listening to another port or another host");
                    this.server.listen(port, hostname, () => {
                        this.port = port;
                        this.hostname = hostname;
                        res(new HttpsServer(this.server))
                    });
                } catch (e) {
                    rej(e);
                }
            })

    /**
     * @returns {Promise<HttpsServer>} the current server
     * 
     * Close the server
     */
    stop = async () =>
        new Promise(
            (res, rej) => {
                if (!this.server.listening)
                    res(new HttpsServer(this.server));
                this.server.close(err => {
                    if (err) rej(err);
                    res(new HttpsServer(this.server));
                });
            }
        )

    /**
     * @param {() => void} listener 
     * @returns {HttpsServer} the current server
     * 
     * Timeout event
     */
    onTimeout = (listener = () => { }) =>
        new HttpsServer(this.server.setTimeout(this.timeout, listener));
}