import winston from "winston";

class Logger {
    private logger: winston.Logger;
    constructor({ service }: { service: string }) {
        const { combine, timestamp, printf, colorize } = winston.format;
        const logFormat = printf(({ level, message, timestamp }) => {
            return `[${timestamp}] [${level}] [${service}]: ${message}`;
        });
        this.logger = winston.createLogger({
            defaultMeta: { service: service },
            format: combine(
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                colorize(),
                logFormat
            ),
            transports: [
                new winston.transports.File({ filename: "info.log", level: "info" }),
                new winston.transports.File({ filename: "error.log", level: "error" }),
                new winston.transports.Console(),
            ],
        });
    }

    public infoLogging({ message }: { message: string }) {
        this.logger.info(message);
    }

    public errorLogging({ message }: { message: string }) {
        this.logger.error(message);
    }
}

export default Logger;
