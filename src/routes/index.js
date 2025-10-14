import { Router } from "express";
import authRoute from './authRoute.js'
import labelRoute from './labelRoute.js'
import { verifySession } from "../controllers/authController.js";

const router = Router()

router.use('/auth', authRoute)
router.use('/label', verifySession, labelRoute)

export default router