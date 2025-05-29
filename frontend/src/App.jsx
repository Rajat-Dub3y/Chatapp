import { Routes,Route, Navigate } from "react-router"
import Home from "./pages/Home"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import Notification from "./pages/Notification"
import CallPage from "./pages/CallPage"
import OnboardingPage from "./pages/OnboardingPage"
import ChatPage from "./pages/ChatPage"
import {Toaster} from "react-hot-toast"
import { axiosInstance } from "./lib/axios"
import {useQuery} from "@tanstack/react-query"

const App=()=> {

  const {data:authData,isLoading,error}=useQuery({
    queryKey:["authUser"],
    queryFn:async()=>{
      const res=await axiosInstance.get("http://localhost:5001/api/auth/me")
      return res.data;
    }
  })
  const authUser=authData?.user

  return (
    <div className="h-screen" data-them="night">
      <Routes>
        <Route path="/" element={authUser? <Home/> :<Navigate to="/login" />  }/>
        <Route path="/signup" element={ !authUser ? <SignUpPage/> : <Navigate to="/"/> } />
        <Route path="/login" element={ !authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/notifications" element={<Notification/>}/>
        <Route path="/call" element={authUser? <CallPage/> :<Navigate to="/login" /> }/>
        <Route path="/chat" element={authUser? <ChatPage/> :<Navigate to="/login" /> }/>
        <Route path="/onboarding" element={authUser? <OnboardingPage/> :<Navigate to="/login" /> }/>
        <Route path="/" element={<Home/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
