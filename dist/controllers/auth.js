import { isUserExist } from "../services/userServices.js";
export async function authentication(req, res) {
    const userData = req.body;
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
            }
            else {
                res.json({
                    status: true,
                    message: "Successfully log user into session",
                });
            }
        });
    }
}
//# sourceMappingURL=auth.js.map