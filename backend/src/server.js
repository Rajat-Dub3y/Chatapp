import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRouters.js"
import chatRouter from "./routes/chatRouters.js"
import connectDB from "./utils/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app= express()
const port=process.env.PORT


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



app.listen(port,()=>{
    console.log("Server is running on port 5001")
})