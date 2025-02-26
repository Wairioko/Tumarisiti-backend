export const logoutController = (req, res) => {
    res.clearCookie("authToken");
    return res.status(200).send("Logged out");
}

