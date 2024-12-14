import "./instrument.js";
import "dotenv/config";
import ExpressServer from "./packages/ExpressServer.js";
import S3 from "./packages/S3.js";
import { startBot, parseData } from "./services/parseServices.js";
import authRouter from "./routes/auth.js";
// import { removeAd } from "./services/adService.js";
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
//# sourceMappingURL=app.js.map