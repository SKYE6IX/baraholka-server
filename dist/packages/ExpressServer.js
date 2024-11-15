import express from "express";
import http from "http";
class ExpressServer {
    constructor(port) {
        this.app = express();
        this.port = port;
        this.serverHandler = http.createServer(this.app);
    }
    startServer() {
        this.serverHandler.listen(this.port, () => {
            console.log("Server start running on port " + this.port);
        });
    }
}
export default ExpressServer;
