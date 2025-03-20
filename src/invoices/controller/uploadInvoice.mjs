import {invoiceModel} from "../model/invoiceModel.mjs";
import { verifyJWT } from "../../../middlewares.mjs";
import multer from 'multer';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { companyModel } from "../../user/model/userCompanyModel.mjs";


// // async functiion to verify invoices with KRA using the batchId
// const verifyInvoicesWithKRA = async (batchId) => {
//     try{
//         const invoices = await invoiceModel.find({batchId, invoiceStatus: "Pending"})
        
//         for (const invoice of invoices){
//             const isTransmitted = await checkKRATransmission(invoice.invoiceNumber)

//             await invoiceModel.updateOne({
//                 _id: invoice._id,
//                 invoiceStatus: isTransmitted ? "Transmitted" : "Pending"
//             });
//         }
//     }catch(error){
//         console.error(error)
//         res.status(500).send("Error when verifying invoices with KRA")
//     }
// };


// const checkKRATransmission = async (invoiceNumber) => {
//     const response = axios.post(`${process.env.KRA_CHECK_URL}/${invoiceNumber}`)
//     if(response.status === 200){
//         return true
//     }else{
//         return false
//     }
// }   
// Mock KRA service functions
const MOCK_TRANSMISSION_RATE = 0.7; // 70% of invoices will be marked as transmitted

const mockCheckKRATransmission = async (invoiceNumber) => {
    // Simulate API delay (100-500ms)
    const delay = Math.floor(Math.random() * 400) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Deterministic but pseudo-random result based on invoice number
    const hash = invoiceNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 100) < (MOCK_TRANSMISSION_RATE * 100);
};

const mockVerifyInvoicesWithKRA = async (batchId) => {
    try {
        const invoices = await invoiceModel.find({ batchId, invoiceStatus: "Pending" });
        console.log(`Processing ${invoices.length} invoices for batch ${batchId}`);
        
        const results = [];
        
        for (const invoice of invoices) {
            const isTransmitted = await mockCheckKRATransmission(invoice.invoiceNumber);
            
            // Update invoice status
            await invoiceModel.findByIdAndUpdate(
                invoice._id,
                { $set: { invoiceStatus: isTransmitted ? "Transmitted" : "Pending" } },
                { new: true }
            );
            
            results.push({
                invoiceNumber: invoice.invoiceNumber,
                status: isTransmitted ? "Transmitted" : "Pending"
            });
            
            console.log(`Invoice ${invoice.invoiceNumber}: ${isTransmitted ? "Transmitted" : "Pending"}`);
        }
        
        return {
            batchId,
            processedCount: invoices.length,
            results
        };
        
    } catch (error) {
        console.error("Error in mock KRA verification:", error);
        throw error;
    }
};

export const createInvoice = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Missing CSV file to upload" });
        }
           
        const userCompanyPin = req.user;
        console.log("Creating invoice company id", userCompanyPin);

        const findCompanyId = await companyModel.findOne({ KRApin: userCompanyPin });
        console.log("the company id mongoose", findCompanyId);

        if (!findCompanyId || !mongoose.Types.ObjectId.isValid(findCompanyId._id)) {
            return res.status(400).json({ message: "Invalid User Company ID" });
        }

        const batchId = uuidv4();
        const results = [];
        console.log("the batchId", batchId);

        const stream = Readable.from(req.file.buffer.toString());

        stream
            .pipe(csvParser({
                headers: ['sellerPin', 'sellerName', 'invoiceNumber', 'invoiceAmount'],
                skipEmptyLines: true
            }))
            .on("data", (row) => {
                if (!row.sellerPin || !row.sellerName || !row.invoiceNumber || !row.invoiceAmount) {
                    console.error("Missing required fields in row:", row);
                    return;
                }

                const invoiceData = {
                    sellerPin: row.sellerPin,
                    sellerName: row.sellerName,
                    invoiceNumber: row.invoiceNumber,
                    invoiceAmount: parseFloat(row.invoiceAmount),
                    companyPin: new mongoose.Types.ObjectId(findCompanyId._id),
                    batchId,
                };

                results.push(invoiceData);
            })
            .on("end", async () => {
                try {
                    if (results.length === 0) {
                        return res.status(400).json({ 
                            message: "No valid data found in CSV file" 
                        });
                    }

                    await invoiceModel.insertMany(results);
                    console.log("Data saved successfully!");

                    res.status(200).json({
                        message: "Successfully uploaded data",
                        batchId,
                        recordsProcessed: results.length
                    });

                    // verifyInvoicesWithKRA(batchId);
                    mockVerifyInvoicesWithKRA(batchId)
                    .then(result => {
                        console.log("Mock KRA verfication completed", result)
                    })
                    .catch(error => {
                        console.error("Mock KRA verification failed:", error);
                        res.status(500).json({ message: "Mock KRA verification failed" });
                    })

                    
                } catch (error) {
                    console.error("Error saving to database:", error);
                    res.status(500).json({ message: "Error saving to database" });
                }
            })
            .on("error", (error) => {
                console.error("CSV Parsing Error:", error);
                res.status(500).json({ message: "Error processing CSV file" });
            });

    } catch (error) {
        console.error("Error handling upload:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

