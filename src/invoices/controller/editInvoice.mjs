import { verifyJWT } from "../../../middlewares.mjs";
import {invoiceModel} from "../model/invoiceModel.mjs";


export const editInvoice = async (req, res) => {
    const companyId = verifyJWT();
    
    const {KRApin, invoiceNumber} = req.body();
    if(!companyId){
        res.status(404).send("Please login to continue")
    }
    try{
        const findInvoiceId = await invoiceModel.findOne({invoiceNumber})
        const findInvoice = invoiceModel.findByIdAndUpdate(findInvoiceId._id, 
            { 
                invoiceNumber: invoiceNumber,
                sellerPin:KRApin
            })
        
        await findInvoice.save()
        
        res.status(201).send("Invoice updated successfully")
    }catch(error){
        console.error(error)
        res.status(500).send("Error while updating invoice")
    }
}




