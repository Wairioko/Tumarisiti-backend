import Router from "express"
import { checkInvoice } from "../controller/checkInvoice.mjs";
import { createInvoice } from "../controller/createInvoice.mjs";
import multer from "multer";
import { deleteInvoice } from "../controller/deleteInvoice.mjs";
import { editInvoice } from "../controller/editInvoice.mjs";



const router = Router();

const storage = multer.memoryStorage();

const upload = multer({storage})

router.get('/api/invoice/check', checkInvoice )
router.post('/api/invoice/upload', upload.fileFilter, createInvoice)
router.delete('/api/invoice/delete', deleteInvoice)
router.put('/api/invoice/update', editInvoice)



export default router;

