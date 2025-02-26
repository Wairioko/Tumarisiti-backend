import mongoose from "mongoose";


const SupplierDataSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    KRApin:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    }
    
})



export const SupplierData = mongooose.model('SupplierData', SupplierDataSchema)

