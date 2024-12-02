import "dotenv/config";
import ExpressServer from "./packages/ExpressServer.js";
import S3 from "./packages/S3.js";
import { startBot, parseData } from "./services/parseServices.js";
// import { removeAd } from "./services/adService.js";
const PORT = 3000;
// Instance for the Server
const server = new ExpressServer(PORT);
// AWS S3 instance
new S3();
// Starting gramJS bot for telegram
startBot();
// removeAd("c05a129a-9f33-4004-a5f3-aff35eeeb64a");
// Parsing data from gramJs and turning into ads
parseData();
// Starting sever
server.startServer();
