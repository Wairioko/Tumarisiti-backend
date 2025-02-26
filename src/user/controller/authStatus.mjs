import jwt from 'jsonwebtoken';
import { companyModel } from '../model/userCompanyModel.mjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();


export const checkAuth = async (req, res, next) => {
    try {
  
        // Parse the cookie string manually
        const cookieString = req.headers.cookie;
        let token = null;
        
        if (cookieString) {
            const cookies = cookieString.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});
            token = cookies.authToken;
        }

        // Fallback to Authorization header if cookie not found
        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "No authentication token found",
            });
        }

        const decoded = jwt.verify(token, process.env.AuthTokenSecret);

        const company = await companyModel.findOne({ KRApin: decoded.KRApin }).select("-password");
        if (!company) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "Company not found",
            });
        }

        return res.status(200).json({
            isAuthenticated: true,
            message: "Authentication successful",
            company: {
                id: company._id,
                companyName: company.companyName,
                email: company.email,
                KRApin: company.KRApin,
                isActive: company.isActive,
            },
        });

    } catch (error) {
        console.log("Authentication error:", error);
        return res.status(401).json({
            isAuthenticated: false,
            message: "Authentication failed",
        });
    }
};

