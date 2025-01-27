import {invoiceModel} from "../model/invoiceModel.mjs";
import { verifyJWT } from "../../../middlewares.mjs";
import multer from 'multer';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import { Readable } from 'stream';

export const createInvoice = async (req, res) => {
    if(!req.file){
        return res.status(400).send("Missing csv file to upload")
    }

    const storage = multer.memoryStorage();
    const upload = multer({storage});
    const userCompanyId = verifyJWT()

    try{
        const results = [];

        const stream = Readable.from(req.file.buffer.toString());
        stream.pipe(csvParser()).on('data', (row) => {
            const invoiceData = {
                sellerPin: row[0],
                invoiceNumber: row[1],
                invoiceAmount: row[2],
                companyPin: new mongoose.Types.ObjectId(userCompanyId)
            };

        results.push(invoiceData)
        })
        .on('end', async() => {
            try{
                await invoiceModel.insertMany(results);
                res.status(200).send("Successfully uploaded data")
                res.redirect('/invoices/analysis')

            }catch(error){
                console.error('Error saving to database:', error);
                res.status(500).json({ message: 'Error saving to database' });
            }
        })

        .on('error', (error) => {
            console.error('CSV Parsing Error:', error);
            res.status(500).json({ message: 'Error processing CSV file' });
        })

    }catch(error){
        console.error('Error handling upload:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

