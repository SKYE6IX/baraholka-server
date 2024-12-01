import * as fs from "fs";
import * as path from "path";

function handleError(error: unknown) {
    const logFilePath = path.resolve(".", "error.log");
    const timeStamp = new Date().toString();
    let logMessage = `[${timeStamp}]: `;

    if (error instanceof Error) {
        console.error(`Error Message: ${error.message}`);
        console.error(`Stack Trace: ${error.stack}`);
        logMessage += `Error Message: ${error.message}.\nStack Trace:\n${error.stack}\n\n`;
    } else {
        logMessage += `Unknown error occur: ${JSON.stringify(error)}\n\n`;
        console.log(`Unknown error occur: ${JSON.stringify(error)}`);
    }
    // Only create a log file in production
    if (process.env.NODE_ENV === "production") {
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error("Failed to log to file..." + err);
            }
        });
    }
}
export default handleError;
