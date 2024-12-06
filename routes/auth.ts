import { Router } from "express";
import { authentication } from "controllers/auth";

const authRouter = Router();

authRouter.route("/auth/telegram").post(authentication);

export default authRouter;
