import { Routes,Route, Navigate } from "react-router"
import Home from "./pages/Home"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import Notification from "./pages/Notification"
import CallPage from "./pages/CallPage"
import OnboardingPage from "./pages/OnboardingPage"
import ChatPage from "./pages/ChatPage"
import {Toaster} from "react-hot-toast"
import Loader from "./components/Loader"
import useAuthUser from "./hooks/useAuthUser"
import Layout from "./components/Layout"

const App=()=> {

  const {isLoading,authUser}=useAuthUser();

  const isAuth=Boolean(authUser)
  const isOnboarded=authUser?.isOnboarded

  if(isLoading) return <Loader />

  return (
    <div className="h-screen" data-them="night">
      <Routes>
        <Route path="/" element={isAuth && isOnboarded? (<Layout showSidebar={true} > <Home/> </Layout>) : <Navigate to={ !isAuth? `/login` : "onboarding" } />  }/>
        <Route path="/signup" element={ !isAuth ? <SignUpPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding" }/> } />
        <Route path="/login" element={ !isAuth ? <LoginPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding" }/>}/>
        <Route path="/notifications" element={<Notification/>}/>
        <Route path="/call" element={isAuth? <CallPage/> :<Navigate to="/login" /> }/>
        <Route path="/chat" element={isAuth? <ChatPage/> :<Navigate to="/login" /> }/>
        <Route path="/onboarding" element={isAuth? (!isOnboarded ? <OnboardingPage/> : <Navigate to="/" />) :<Navigate to="/login" /> }/>
        <Route path="/" element={<Home/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
