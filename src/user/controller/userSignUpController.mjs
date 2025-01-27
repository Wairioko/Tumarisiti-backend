import { companyModel } from "../model/userCompanyModel.mjs"
import bcrypt from "bcrypt"
import dotenv from "dotenv"


dotenv.config()


export const companySignup = async (req, res) => {
    const {companyName, KRApin, email, password} = req.body;
    console.log("the body", req.body)

    if(!companyName || !KRApin || !email || !password){
        return res.status(400).send("Missing data required for registration. Please fill and try again")
    }

    const saltRounds = bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try{
        const companyRecord = companyModel({
            companyName, 
            KRApin,
            email,
            password:hashedPassword,

        })

        await companyRecord.save()

        res.status(201).send("Company registered successfully")
        res.redirect('/company/confirmation')

    }catch(error){
        return res.status(500).send("Server error creating company record")
    }

}


