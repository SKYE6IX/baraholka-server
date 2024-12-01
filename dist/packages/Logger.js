import winston from "winston";
class Logger {
    constructor({ service }) {
        const { combine, timestamp, printf, colorize } = winston.format;
        const logFormat = printf(({ level, message, timestamp }) => {
            return `${service}:\n [${timestamp}] [${level}]: ${message}`;
        });
        this.logger = winston.createLogger({
            level: "info",
            defaultMeta: { service: service },
            format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), logFormat),
        });
    }
    logToConsole() {
        if (process.env.NODE_ENV !== "production") {
            this.logger.add(new winston.transports.Console());
        }
    }
    infoLogging({ message }) {
        this.logToConsole();
        this.logger.add(new winston.transports.File({
            filename: "info.log",
            level: "info",
        }));
        this.logger.log({
            level: "info",
            message: message,
        });
    }
    errorLogging({ message }) {
        this.logToConsole();
        this.logger.add(new winston.transports.File({
            filename: "error.log",
            level: "error",
        }));
        this.logger.log({
            level: "error",
            message: message,
        });
    }
}
export default Logger;
