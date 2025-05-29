import express from "express"
import { LogOut, SignIn, SignUp, onboard } from "../controllers/authControllers.js"
import { protectedRoutes } from "../middleware/authMiddleware.js"


const router = express.Router()


router.post("/signup",SignUp)
router.post("/login",SignIn)
router.post("/logout",LogOut)
router.post("/onboarding",protectedRoutes,onboard)
router.get("/me", protectedRoutes, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
})

export default router