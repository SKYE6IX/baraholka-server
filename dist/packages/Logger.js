import winston from "winston";
class Logger {
    constructor({ service }) {
        const { combine, timestamp, printf, colorize } = winston.format;
        const logFormat = printf(({ level, message, timestamp }) => {
            return `[${timestamp}] [${level}] [${service}]: ${message}`;
        });
        this.logger = winston.createLogger({
            defaultMeta: { service: service },
            format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), logFormat),
            transports: [
                new winston.transports.File({ filename: "info.log", level: "info" }),
                new winston.transports.File({ filename: "error.log", level: "error" }),
                new winston.transports.Console(),
            ],
        });
    }
    // private logToConsole(level: string) {
    //     if (process.env.NODE_ENV !== "production") {
    //         this.logger.add(new winston.transports.Console({ level: level }));
    //     }
    // }
    infoLogging({ message }) {
        this.logger.info(message);
        // this.logToConsole("info");
        // this.logger.add(
        //     new winston.transports.File({
        //         filename: "info.log",
        //         level: "info",
        //     })
        // );
        // this.logger.log({
        //     level: "info",
        //     message: message,
        // });
    }
    errorLogging({ message }) {
        this.logger.error(message);
        // this.logToConsole("error");
        // this.logger.add(
        //     new winston.transports.File({
        //         filename: "error.log",
        //         level: "error",
        //     })
        // );
        // this.logger.log({
        //     level: "error",
        //     message: message,
        // });
    }
}
export default Logger;
