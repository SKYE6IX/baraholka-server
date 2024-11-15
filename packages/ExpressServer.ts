import express, { Express } from "express";
import http, { Server } from "http";

class ExpressServer {
    private app: Express;
    private port: number;
    private serverHandler: Server;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.serverHandler = http.createServer(this.app);
    }

    public startServer() {
        this.serverHandler.listen(this.port, () => {
            console.log("Server start running on port " + this.port);
        });
    }
}

export default ExpressServer;
