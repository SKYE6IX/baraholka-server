import "dotenv/config";
import "./instrument.js";
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
//         removeAd("e005a373-5f8f-4e19-a981-e820df69ef72");
//     } catch (error) {
//         console.error(error);
//     }
// })();
server.routes(authRouter);
server.defaultErrorHandler();
// Starting sever
server.startServer();
//# sourceMappingURL=app.js.map