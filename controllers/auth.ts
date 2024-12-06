import { Request, Response } from "express";
import { BaseUser } from "types/user";
import { isUserExist } from "services/userServices";

export async function authentication(req: Request, res: Response) {
    const userData = req.body as BaseUser;
    if (!userData.telegramId) {
        res.status(400).json({
            status: false,
            message: "User telegram ID is not included, Authentication failed!",
        });
    }
    const user = await isUserExist(userData);
    if (user) {
        // Extracting those two keys only becuase telegram ID is a bigint
        // And it unable to be serialized in session store(PrismaSesssionStore)
        const sessionUser = {
            id: user.id,
            userName: user.userName,
        };
        req.logIn(sessionUser, (error) => {
            if (error) {
                res.status(500).json({
                    status: false,
                    message: "Unable to log user into session.",
                });
            } else {
                res.json({
                    status: true,
                    message: "Successfully log user into session",
                });
            }
        });
    }
}
