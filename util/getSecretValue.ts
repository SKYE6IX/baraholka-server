import fs from "fs";

function getSecretValue(secretName: string): string {
    if (process.env.NODE_ENV === "production") {
        const path = process.env[secretName]!;
        return fs.readFileSync(path, "utf8").trim();
    } else {
        return process.env[secretName]!;
    }
}
export default getSecretValue;
