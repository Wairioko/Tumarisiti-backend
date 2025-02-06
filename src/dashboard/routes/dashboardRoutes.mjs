import { Router } from "express";
import { dashboardData } from "../controller/dashboard.mjs";
import { verifyJWT } from "../../../middlewares.mjs";

const router = new Router();

router.get('/api/dashboard', verifyJWT ,dashboardData)


export default router;