import express from "express"
import { protectedRoutes } from "../middleware/authMiddleware.js"
import { getStreamToken } from "../controllers/chatControllers.js"


const router = express.Router()

router.get("/token",protectedRoutes,getStreamToken)

export default router