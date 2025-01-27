import InvoiceRoutes from './src/invoices/routes/invoiceRoutes.mjs';
import UserRoutes from './src/user/routes/companyRoutes.mjs';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors'

const app = express();
dotenv.config();



const connectDB = async (retries = 5) => {
    const mongoURI = process.env.MONGODB_URL || process.env.MONGODB_CLOUD_URL;
    console.log("Attempting to connect to MongoDB:", mongoURI);

    try {
        await mongoose.connect(mongoURI, {
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,
        });
        console.log(`Connected to MongoDB: ${mongoURI.includes('localhost') ? 'Local' : 'Cloud'}`);
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        if (retries > 0) {
            console.log(`Retrying to connect in 5 seconds... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectDB(retries - 1);
        }
        console.error("Failed to connect after 5 retries");
        throw error;
    }
};

// Connect to MongoDB
connectDB().then(() => {
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Use the imported routes
    app.use(InvoiceRoutes);
    app.use(UserRoutes);
    app.use(cors({
        origin: 'http://localhost:3000',  
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization'
    }));
    
    app.use(cors());

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch(err => {
    console.error("Error starting server:", err);
});
