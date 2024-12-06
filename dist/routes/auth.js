import { Router } from "express";
import { authentication } from "../controllers/auth.js";
const authRouter = Router();
authRouter.route("/auth/telegram").post(authentication);
export default authRouter;
//# sourceMappingURL=auth.js.map