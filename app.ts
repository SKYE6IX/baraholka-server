import "./instrument";
import "dotenv/config";

import ExpressServer from "./packages/ExpressServer";
import S3 from "packages/S3";
import { startBot, parseData } from "services/parseServices";
import authRouter from "routes/auth";

// Instance for the Server
const server = new ExpressServer();

// Run App Configurations
server.setAppConfig();

// AWS S3 instance
new S3();

// Starting gramJS bot for telegram
startBot();

// Parsing data from gramJs and turning into ads
parseData();

server.routes(authRouter);

server.defaultErrorHandler();

// Starting sever
server.startServer();
