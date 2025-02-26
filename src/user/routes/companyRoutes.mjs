import { companyLogin } from "../controller/userLoginController.mjs";
import { companySignup } from "../controller/userSignUpController.mjs";
import { checkAuth } from "../controller/authStatus.mjs";
import {Router} from 'express'
import { logoutController } from "../controller/logoutController.mjs";

const router = Router();

router.post('/api/company/registration', companySignup)
router.post('/api/company/login', companyLogin)
router.get('/api/auth/status', checkAuth)
router.post('/api/auth/logout', logoutController)


export default router;


