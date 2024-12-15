import "./instrument";
import "dotenv/config";

import ExpressServer from "./packages/ExpressServer";
import S3 from "packages/S3";
import { startBot, parseData } from "services/parseServices";
import authRouter from "routes/auth";
// import { removeAd } from "services/adService";

// Instance for the Server
const server = new ExpressServer();

// Run App Configurations
server.setAppConfig();

// AWS S3 instance
new S3();

// Starting gramJS bot for telegram
startBot();

console.log("HEllo world ");

// Parsing data from gramJs and turning into ads
parseData();

// (async () => {
//     try {
//         await removeAd("d7472a79-88d8-428a-9aef-1e38d0d258fc");
//     } catch (error) {
//         console.log(error);
//     }
// })();

server.routes(authRouter);

server.defaultErrorHandler();

// Starting sever
server.startServer();
