import "dotenv/config";
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
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
    }
    public static async uploadMultipleImage(imageBuffers: Buffer[], adTitle: string) {
        let prefixNum = 1;
        const urlList: string[] = [];
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
    }

    public static async deleteSingleImage(key: string) {
        const response = await this.instance.s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: key,
            })
        );
        return response;
    }

    public static async deleteMultipleImage(keys: string[]) {
        const response = await this.instance.s3Client.send(
            new DeleteObjectsCommand({
                Bucket: process.env.AWS_BUCKET,
                Delete: {
                    Objects: keys.map((key) => ({ Key: key })),
                },
            })
        );
        return response;
    }
}
export default S3;
