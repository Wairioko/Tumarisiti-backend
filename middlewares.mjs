import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { companyModel } from "./src/user/model/userCompanyModel.mjs";

dotenv.config()
const jwtSecret = process.env.AuthTokenSecret;

// function to verify jwt token
export const verifyJWT = async (req, res) => {
    const token = req.cookies.authToken;
    if(!token){
        return res.status(401).send("Unauthorised access. Please login to continue.")
    }

    const verifyToken = jwt.verify(token,jwtSecret)
    const companyPin = verifyToken.KRApin
    const findUserCompanyId = companyModel.findOne({KRApin:companyPin})
    if(!findUserCompanyId){
        return res.status(404).send("User record not found. Please register to continue")
    }
    return findUserCompanyId

}




