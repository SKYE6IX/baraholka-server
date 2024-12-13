import express from "express";
import http from "http";
import cors from "cors";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import * as Sentry from "@sentry/node";
import passport from "passport";
class ExpressServer {
    constructor() {
        this.PORT = process.env.PORT || 8080;
        this.isProduction = process.env.NODE_ENV === "production";
        this.app = express();
        this.serverHandler = http.createServer(this.app);
    }
    setCors() {
        const corsOption = {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        };
        return cors(corsOption);
    }
    setSession() {
        const options = {
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
            if (options.cookie)
                options.cookie.secure = true;
        }
        return expressSession(options);
    }
    setPassportConfig() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
    }
    setAppConfig() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(this.setCors());
        this.app.use(this.setSession());
        this.setPassportConfig();
    }
    routes(route) {
        this.app.use(route);
    }
    defaultErrorHandler() {
        Sentry.setupExpressErrorHandler(this.app);
        this.app.use((err, req, res, next) => {
            res.statusCode = 500;
            res.end(res.sentry + "\n");
        });
    }
    startServer() {
        this.serverHandler.listen(this.PORT, () => {
            console.log("Server start running on port " + this.PORT);
        });
    }
}
export default ExpressServer;
//# sourceMappingURL=ExpressServer.js.map