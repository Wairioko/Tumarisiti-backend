import { companyModel } from "../../user/model/userCompanyModel.mjs";
import { invoiceModel } from "../model/invoiceModel.mjs";
import { verifyJWT } from "../../../middlewares.mjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer"


dotenv.config()

const sendEmailToSupplier = async (KRApin, invoiceNumber) => {
    const company = await companyModel.findById(KRApin)
    if(!company){
        return res.status(404).send("Company not found!")
    }
    try{

        const transporter = nodemailer.createTransport({
            host: userEmailConfig.host,
            port : userEmailConfig.port,
            secure: userEmailConfig.secure,
            auth:{
                user: userEmailConfig.user,
                pass: userEmailConfig.pass
            },
        });
    
        const mailOptions = {
            from: userEmailConfig.user,
            to: company.supplierEmail,
            subject: `Transmit Invoice ${invoiceNumber} to KRA for VAT purposes`,
            text: `
            Hello, 
            I hope this email finds you well. I am contacting you so that you can transmit invoice number: ${invoiceNumber}
            to KRA as soon as possible for VAT purposes so we can claim it.
            Thank you for your help in this matter.
    
            Kind regards,
            ${company.companyName}
            `
        };
    
        const info = await transporter.sendMail(mailOptions);
        await info.response
        return { success: true, message:"Email sent successfully"}
    

    }catch(error){
        console.error(`Error sending email: ${error}`)
        return "Error sending email"
    }
    
}



export const checkInvoice = async (req, res) => {
    const companyId = verifyJWT()
    const findUserInvoices = invoiceModel.find({_id:companyId})
    if(!findUserInvoices){
        return res.status(404).send("Company has no invoice! Upload to proceed")
    }
    try{
        const pendingInvoices = findUserInvoices.findOne({invoiceStatus:'Pending'});

        pendingInvoices.forEach((invoice) =>{
            const invoiceNumber = invoiceModel.findOne({invoice})
            const supplierKRAPin = invoiceNumber.sellerPin
            const findInvoiceStatus = `${process.env.KRA_API_LINK}/${invoiceNumber}`
            if(findInvoiceStatus.status === 200){
                findUserInvoices.invoiceStatus['Transmittted']
            }else if(findInvoiceStatus.status === 404){
                findUserInvoices.invoiceStatus['Pending']
                sendEmailToSupplier(supplierKRAPin, invoiceNumber)
                res.status(404).send("Invoice not transmitted")
            }
        }
    )


    }catch(error){
        console.error(error)
        res.send(500).send("Error when transmitting invoice to KRA")
    }
}


