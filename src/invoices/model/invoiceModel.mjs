import mongoose from "mongoose";


const invoiceSchema = mongoose.Schema({
    sellerPin:{
        type:String,
        required: true
    },
    invoiceNumber:{
        type:String,
        required: true
    },
    invoiceAmount:{
        type: String,
        required: true
    }, 
    companyPin:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserCompany'
    },
    creationDate:{
        type: Date,
        default: Date.now()
    },
    invoiceStatus:{
        type: String,
        default: "Pending"
    }

})


export const invoiceModel = mongoose.model("invoiceModel", invoiceSchema)

