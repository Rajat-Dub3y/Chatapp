import User from "../models/UserModel.js";
import FriendRequest from "../models/FriendsRequests.js";

export const getRecommendedUser=async(requestAnimationFrame,res)=>{
    try{
        const currentUserId=requestAnimationFrame.user._id;
        const currentUser=requestAnimationFrame.user;
        const recommendeduser=await User.find({
            $and:[
                {_id:{$ne:currentUserId}},
                {_id:{$nin:currentUser.friends}},
            ],
        });
        res.status(200).json(recommendeduser)
    }catch(error){
        console.log(error)
        res.status(401).json({message:"Error getting recommendation"})
    }
}

export const getMyFriends=async(req,res)=>{
    try {
        
        const user=await User.findById(req.user._id).select("friends").populate("friends","fullname profilepic nativlanguage learninglaguage")

        res.status(200).json(user.friends)

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error while getting friends"})
    }
}

export const sendFriendRequest=async(req,res)=>{
    try {
        const myId=req.user._id;
        const {id:recipiantId}=req.params;

        if(myId===recipiantId){
            return res.status(400).json({message:"You can't send friend request to yourself"});
        }

        const recipiant=await User.findById(recipiantId)

        if(!recipiant){
            return res.status(404).json({message:"Recipiant not found"})
        }

        if(recipiant.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"});
        }

        const existingRequest=await FriendRequest.findOne({
            $or:[
                {sender:myId,recipiant:recipiantId},
                {sender:recipiantId,recipiant:myId},
            ],
        })
        
        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists"})
        }

        const friendRequest = await new FriendRequest({ sender: myId, recipiant: recipiantId }).save();

        res.status(201).json(friendRequest)


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error while sending friends request"})
    }
}
export const acceptFriendRequest=async(req,res)=>{
    try {

        const {id:requestId}=req.params;

        const friendRequest=await FriendRequest.findOne(requestId);

        if(!friendRequest){
            res.status(404).json({message:"Request not found"})
        }

        if(friendRequest.recipiant.toString()!==req.user._id){
            return res.status(403).json({message:"You are not recipiant of this request"});
        }

        friendRequest.status="accepted";
        await friendRequest.save()

        await User.findByIdAndUpdate(friendRequest.recipiant,{
            $addToSet:{friends:friendRequest.sender}
        })

        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipiant}
        })
        
        res.status(201).json(friendRequest)

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error while accepting friends request"})
    }
}

export const getFriendsRequest=async(req,res)=>{
    try {

        const incomingRequests=await FriendRequest({recipiant:req.user._id,status:"pending"}).populate("sender","fullname profilepic nativelanguage learninglanguage");
        
        const acceptedRequests=await FriendRequest({sender:req.user._id,status:"accepted"}).populate("recipiant","fullname profilepic ");

        res.status(200).json({incomingRequests,acceptedRequests})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error while getting friends request"})
    }
}

export const getOutgoingFriendsRequest=async(req,res)=>{
    try {

        const outgoingRequests=await FriendRequest({sender:req.user._id,status:"pending"}).populate("sender","fullname profilepic nativelanguage learninglanguage");
        
        res.status(200).json({outgoingRequests})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error while getting friends request"})
    }
}