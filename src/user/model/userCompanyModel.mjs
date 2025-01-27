import mongoose from 'mongoose';


const companySchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    KRApin:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
  
    isActive: {
        type: Boolean,
        default: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
})


export const companyModel = mongoose.model("UserCompany", companySchema);



