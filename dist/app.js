import "dotenv/config";
import ExpressServer from "./packages/ExpressServer.js";
import S3 from "./packages/S3.js";
import { startBot, parseData } from "./services/parseServices.js";
// import User from "./models/User.js";
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
const urls = [
    "https://remarket-ads.s3.eu-north-1.amazonaws.com/руль_5.jpeg",
    "https://remarket-ads.s3.eu-north-1.amazonaws.com/руль_1.jpeg",
    "https://remarket-ads.s3.eu-north-1.amazonaws.com/руль_4.jpeg",
    "https://remarket-ads.s3.eu-north-1.amazonaws.com/руль_2.jpeg",
    "https://remarket-ads.s3.eu-north-1.amazonaws.com/руль_3.jpeg",
];
async function removeMedia(urls, title) {
    try {
        const pattern = new RegExp(/[\s\p{P}]+/gu);
        const convertTitle = title.replace(pattern, "_").toLowerCase();
        if (urls.length > 1) {
            const keys = urls.sort().map((url, i) => {
                const startIndex = url.indexOf(convertTitle + "_" + (i + 1));
                const key = url.substring(startIndex, url.length);
                return key;
            });
            await S3.deleteMultipleImage(keys);
        }
        else if (urls.length <= 1) {
            const singleUrl = urls[0];
            const startIndex = singleUrl.indexOf(convertTitle);
            const key = singleUrl.substring(startIndex, singleUrl.length);
            // await S3.deleteSingleImage(key);
            console.log(key);
        }
    }
    catch (error) {
        console.log(error);
        // handleError(error);
    }
}
removeMedia(urls, "Руль");
// (() => {
//     // const url =
//     //     "https://remarket-ads.s3.eu-north-1.amazonaws.com/macbook_pro_14_m2_pro_16_512_space_gray.jpeg";
//     // // const pattern = new RegExp("macbook_pro_14_m2_pro_16_512_space_gray");
//     // console.log("Hey Tester");
//     // const index = url.indexOf("macbook_pro_14_m2_pro_16_512_space_gray");
//     // console.log(index);
//     // const key = url.substring(index, url.length);
//     // console.log(key);
// })();
// Starting gramJS bot for telegram
startBot();
// Parsing data from gramJs and turning into ads
parseData();
// Starting sever
server.startServer();
