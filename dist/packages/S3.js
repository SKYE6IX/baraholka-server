import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { fromEnv } from "@aws-sdk/credential-providers";
class S3 {
    constructor() {
        if (!S3.instance) {
            this.s3Client = new S3Client({
                region: process.env.AWS_REGION,
                credentials: fromEnv(),
            });
            S3.instance = this;
        }
        else {
            return S3.instance;
        }
    }
    static replaceTitle(title) {
        const pattern = new RegExp(/[\s\p{P}]+/gu);
        if (pattern.test(title)) {
            return title.replace(pattern, "_").toLowerCase();
        }
        else {
            return title.toLowerCase();
        }
    }
    static getUrl(key) {
        const { AWS_BUCKET, AWS_REGION } = process.env;
        return `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    }
    static async uploadSingleImage(imageBuffer, adTitle) {
        try {
            const format = (await sharp(imageBuffer).metadata()).format;
            const title = this.replaceTitle(adTitle);
            const key = `${title}.${format}`;
            await this.instance.s3Client.send(new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Body: imageBuffer,
                Key: key,
                ContentType: `image/${format}`,
            }));
            return this.getUrl(key);
        }
        catch (error) {
            console.log(error);
            console.log("Unable to upload object");
        }
    }
    static async uploadMultipleImage(imageBuffers, adTitle) {
        let prefixNum = 1;
        const urlList = [];
        try {
            const title = this.replaceTitle(adTitle);
            const photos = imageBuffers.map(async (buf) => {
                const format = (await sharp(buf).metadata()).format;
                return {
                    Key: `${title + "_" + prefixNum++}.${format}`,
                    Body: buf,
                    ContentType: `image/${format}`,
                };
            });
            for (const photo of photos) {
                await this.instance.s3Client.send(new PutObjectCommand({
                    Bucket: "remarket-ads",
                    Body: (await photo).Body,
                    Key: (await photo).Key,
                    ContentType: (await photo).ContentType,
                }));
                const url = this.getUrl((await photo).Key);
                urlList.push(url);
            }
            return urlList;
        }
        catch (error) {
            console.log(error);
            console.log("Unable to upload object");
        }
    }
}
export default S3;
