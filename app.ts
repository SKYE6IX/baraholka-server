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

// (async () => {
//     try {
//         const res = await S3.deleteSingleImage(
//             "https://remarket-ads.s3.eu-north-1.amazonaws.com/macbook_pro_14_m2_pro_16_512_space_gray.jpeg"
//         );
//         console.log("Succeasfully delete");
//         console.log(res);
//     } catch (error) {
//         console.log(error);
//     }
// })();

// Starting gramJS bot for telegram
startBot();

// Parsing data from gramJs and turning into ads
parseData();

// Starting sever
server.startServer();
