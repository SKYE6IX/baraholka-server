import express, { Express, Router, Request, Response, NextFunction } from "express";
import http, { Server } from "http";
import cors, { CorsOptions } from "cors";
import expressSession, { SessionOptions } from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import * as Sentry from "@sentry/node";
import passport from "passport";

class ExpressServer {
    private app: Express;
    private serverHandler: Server;
    private PORT = process.env.PORT || 8080;
    private isProduction = process.env.NODE_ENV === "production";

    constructor() {
        this.app = express();
        this.serverHandler = http.createServer(this.app);
    }

    private setCors() {
        const corsOption: CorsOptions = {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        };
        return cors(corsOption);
    }

    private setSession() {
        const options: SessionOptions = {
            cookie: {
                httpOnly: true,
                secure: this.isProduction,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            },
            name: "reMarketSession",
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
            store: new PrismaSessionStore(new PrismaClient(), {
                checkPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }),
        };
        if (this.isProduction) {
            this.app.set("trust proxy", 1);
            if (options.cookie) options.cookie.secure = true;
        }
        return expressSession(options);
    }

    private setPassportConfig() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user as Express.User));
    }

    public setAppConfig() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(this.setCors());
        this.app.use(this.setSession());
        this.setPassportConfig();
    }

    public routes(route: Router) {
        this.app.use(route);
    }

    public defaultErrorHandler() {
        Sentry.setupExpressErrorHandler(this.app);
        this.app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
            res.statusCode = 500;
            res.end(res.sentry + "\n");
        });
    }

    public startServer() {
        this.serverHandler.listen(this.PORT, () => {
            console.log("Server start running on port " + this.PORT);
        });
    }
}

export default ExpressServer;
