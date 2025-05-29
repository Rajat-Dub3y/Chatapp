import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser,generateStreamToken } from "../utils/stream.js";

export const SignUp=async(req,res)=>{
    const {email,password,fullname}=req.body;

    try{
        if(!email || !password || !fullname){
            return res.status(400).json({message:"All fields are needed"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password should be alteast 6 character long"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const exisitingUser= await User.findOne({email})

        if(exisitingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const idx=Math.floor(Math.random()*100)+1;
        const randomAvatar=`https://avatar-placeholder.iran.liara.run/${idx}.png`

        const newUser=await User.create({
            email,fullname,password,profilepic:randomAvatar
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullname}`);
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }

        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

        res.cookie("jwt",token,{
            maxAge:24*60*60*1000,
            httpOnly:true,
            sameSite:"Strict",
            secure:process.env.NODE_ENV==="production"
        })

        const { password: _, ...returnUser } = newUser.toObject();

        res.status(200).json({success:true,user:returnUser})


    }catch(error){
        console.log(error)
        res.status(500).json({message:"Error while creating user"})
    }
}

export const SignIn=async(req,res)=>{
    try {
        
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"no email or password"})
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(401).json({message:"Invalid email"})
        }

        const isPasswordCorrect=await user.matchPassword(password);

        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invaild password"})
        }

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

        res.cookie("jwt",token,{
            maxAge:24*60*60*1000,
            httpOnly:true,
            sameSite:"Strict",
            secure:process.env.NODE_ENV==="production"
        })

        const { password: _, ...returnUser } = user.toObject();

        res.status(200).json({success:true,returnUser})


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error while logining"})
    }
}

export const LogOut=async(req,res)=>{
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"Loged out"})
}

export const onboard=async(req,res)=>{
    try {
        
        const userId=req.user._id;
        const {fullname,bio,nativelanguage,learninglanguage,location}=req.body;

        if(!fullname || !bio || !nativelanguage || !learninglanguage || !location){
            return res.status(400).json({
                message:"All field are required",
                missingField:[!fullname && "fullname",!bio && "bio",!nativelanguage && "native Language",!learninglanguage && "leraning language", !location && "location"].filter(Boolean)
            })
        }

        const updatedUser=await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true,
        },{new:true})

        if(!updatedUser) return res.status(404).json({message:"User not found"})

        try {

            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullname,
                image:updatedUser.profilePic || ""
            })
            
            console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`)

        } catch (error) {
            console.log("error while updating stream user",error.message )
        }
        
        res.status(200).json({success:true,user:updatedUser})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}