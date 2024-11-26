import "dotenv/config";
import ExpressServer from "./packages/ExpressServer";
import S3 from "packages/S3";
import { startBot, parseData } from "services/parseServices";
// import User from "models/User";

const PORT = 3000;

// Instance for the Server
const server = new ExpressServer(PORT);

// AWS S3 instance
new S3();

// Starting gramJS bot for telegram
startBot();

// Parsing data from gramJs and turning into ads
parseData();

// Starting sever
server.startServer();
