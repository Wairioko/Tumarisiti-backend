import {invoiceModel} from "../model/invoiceModel.mjs";
import { verifyJWT } from "../../../middlewares.mjs";


export const deleteInvoice = async (req, res) => {
    const {invoiceNumber} = req.body()
    const companyId = verifyJWT();
    if(!companyId){
        res.status(401).send("Please register to delete the invoice")
    }
    try{
        const findInvoice = invoiceModel.findByIdAndDelete({invoiceNumber: invoiceNumber});
        await findInvoice();
        return res.status(200).send("Invoice deleted successfully");
    }catch(error){
        res.status(500).send("Invoice deleted successfully");
    }

}


