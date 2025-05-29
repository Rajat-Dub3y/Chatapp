import express from "express"
import { getRecommendedUser,getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendsRequest, getOutgoingFriendsRequest } from "../controllers/userController.js"
import { protectedRoutes } from "../middleware/authMiddleware.js"
const router = express.Router()

router.use(protectedRoutes)

router.get("/",getRecommendedUser);
router.get("/friends",getMyFriends);

router.post("/friend-requests/:id",sendFriendRequest)
router.post("/friend-requests/:id/accept",acceptFriendRequest)

router.get("/friend-requests",getFriendsRequest)
router.get("/outgoing-friend-requests",getOutgoingFriendsRequest)

export default router