import "dotenv/config";
import ExpressServer from "./packages/ExpressServer.js";
import S3 from "./packages/S3.js";
import { startBot, parseData } from "./services/parseServices.js";
// import User from "./models/User.js";
const PORT = 3000;
// Instance for the Server
const server = new ExpressServer(PORT);
// (async () => {
//     try {
//         await User.deletUser(2477350489n);
//     } catch (error) {
//         console.log(error);
//     }
// })();
// AWS S3 instance
new S3();
// Starting gramJS bot for telegram
startBot();
// Parsing data from gramJs and turning into ads
parseData();
// Starting sever
server.startServer();
