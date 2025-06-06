import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRouters.js"
import chatRouter from "./routes/chatRouters.js"
import connectDB from "./utils/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"

const app= express()
const port=process.env.PORT

const __dirname=path.resolve()


dotenv.config()
await connectDB();


app.use(express.json())
app.use(cookieParser())
app.use(
cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



// Routes

app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api/chat",chatRouter)

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
  })
}

app.listen(port,()=>{
    console.log("Server is running on port 5001")
})