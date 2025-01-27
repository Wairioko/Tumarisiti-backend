import { companyModel } from "../model/userCompanyModel.mjs";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getCookieConfig } from "../../../constants.mjs";

dotenv.config()

export const companyLogin = async (req, res) => {
    const {KRApin, password} = req.body;
    if(!KRApin || !password){
        return res.status(400).send("Please fill missing data")
    }

    try{
        const findCompany = companyModel.findOne({KRApin:KRApin});
        if(!findCompany){
            res.status(404).send("Company not found. Register to continue using service ")
            return res.redirect('/company/registration')
        }

        const hashedPassword = findCompany.password
        const passwordValidation = await bcrypt.compareSync(password, hashedPassword);
        if(!passwordValidation){
            return res.status(400).send("Error! Please input correct password")
        }
        const tokenSecret = process.env.AuthTokenSecret;
        const token = jwt.sign(KRApin, tokenSecret,{
            expiresIn: '1h'
        } )

        res.cookie('authToken', token, getCookieConfig())
        res.status(201).send("Successfully logged in")
        res.redirect('/')

    }catch(error){
        console.error("loggging in ", error)
        return res.status(500).send("Error logging in. Please try again later")   
    }
}


