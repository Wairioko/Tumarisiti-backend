import Router from "express"
import { createInvoice } from "../controller/createInvoice.mjs";
import multer from "multer";
import { deleteInvoice } from "../controller/deleteInvoice.mjs";
import { editInvoice } from "../controller/editInvoice.mjs";
import { invoiceStatus } from "../controller/invoiceStatus.mjs";
import { verifyJWT } from "../../../middlewares.mjs";



const router = Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/api/invoice/upload', verifyJWT,  upload.single('file'), createInvoice);
// router.get('/api/invoices/check', verifyJWT ,checkInvoice )
router.delete('/api/invoice/delete',verifyJWT, deleteInvoice)
router.put('/api/invoice/update', verifyJWT ,editInvoice)
router.get('/api/invoices/status', verifyJWT,invoiceStatus)




export default router;

