import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { fromEnv } from "@aws-sdk/credential-providers";

class S3 {
    private static instance: S3;
    private s3Client: S3Client;

    constructor() {
        if (!S3.instance) {
            this.s3Client = new S3Client({
                region: process.env.AWS_REGION,
                credentials: fromEnv(),
            });
            S3.instance = this;
        } else {
            return S3.instance;
        }
    }
    private static replaceTitle(title: string) {
        const pattern = new RegExp(/[\s\p{P}]+/gu);
        if (pattern.test(title)) {
            return title.replace(pattern, "_").toLowerCase();
        } else {
            return title.toLowerCase();
        }
    }
    private static getUrl(key: string) {
        const { AWS_BUCKET, AWS_REGION } = process.env;
        return `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    }
    public static async uploadSingleImage(imageBuffer: Buffer, adTitle: string) {
        try {
            const format = (await sharp(imageBuffer).metadata()).format;
            const title = this.replaceTitle(adTitle);
            const key = `${title}.${format}`;
            await this.instance.s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Body: imageBuffer,
                    Key: key,
                    ContentType: `image/${format}`,
                })
            );
            return this.getUrl(key);
        } catch (error) {
            console.log(error);
            console.log("Unable to upload object");
        }
    }

    public static async uploadMultipleImage(imageBuffers: Buffer[], adTitle: string) {
        let prefixNum = 1;
        const urlList: string[] = [];
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
                await this.instance.s3Client.send(
                    new PutObjectCommand({
                        Bucket: "remarket-ads",
                        Body: (await photo).Body,
                        Key: (await photo).Key,
                        ContentType: (await photo).ContentType,
                    })
                );
                const url = this.getUrl((await photo).Key);
                urlList.push(url);
            }
            return urlList;
        } catch (error) {
            console.log(error);
            console.log("Unable to upload object");
        }
    }
}
export default S3;
