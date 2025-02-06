import { invoiceModel } from "../../invoices/model/invoiceModel.mjs"
import { companyModel } from "../../user/model/userCompanyModel.mjs";


export const dashboardData = async (req, res) => {
    const companyPin = req.user;

    if(!companyPin){
        return res.status(401).send("Please login to view dashboard data")
    }
    try {
        const findCompanyId = companyModel.findOne({KRApin: companyPin})
        
        if(!findCompanyId){
            return res.status(404).send("Company not found")
        }

        const companyMongoId = findCompanyId._id;
        
        const companyInvoices = await invoiceModel.find({companyMongoId})

        if(!companyInvoices){
            return res.status(400).send("No invoices uploaded yet. Please try again later")
        }
        return res.status(200).json(companyInvoices)
            
    } catch (error) {
        console.error("Error retrieving dashboard data", error);
        return res.status(500).send("Error retrieving dashboard data. Please try again later");
    }
}

