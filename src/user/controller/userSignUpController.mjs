import { companyModel } from "../model/userCompanyModel.mjs"
import bcrypt from "bcrypt"
import dotenv from "dotenv"


dotenv.config()


export const companySignup = async (req, res) => {
    const {companyName, KRApin, email, password} = req.body;
    

    if(!companyName || !KRApin || !email || !password){
        return res.status(400).send("Missing data required for registration. Please fill and try again")
    }

    const saltRounds = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try{
        const companyRecord = companyModel({
            companyName, 
            KRApin,
            email,
            password:hashedPassword,

        })

        await companyRecord.save()
       
        res.status(200).send("Company registered successfully")
        

    }catch(error){
        console.log("error creating company", error)
        return res.status(500).send("Server error creating company record")
    }

}


