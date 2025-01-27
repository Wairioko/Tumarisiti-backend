import { companyLogin } from "../controller/userLoginController.mjs";
import { companySignup } from "../controller/userSignUpController.mjs";
import {Router} from 'express'

const router = Router();

router.post('/api/company/registration', companySignup)
router.post('/api/company/login', companyLogin)


export default router;


