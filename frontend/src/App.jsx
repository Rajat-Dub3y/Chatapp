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
import { useThemeStore } from "./store/useThemeStore"
import Friends from "./pages/Friends"

const App=()=> {

  const {isLoading,authUser}=useAuthUser();

  const {theme}=useThemeStore()
  const isAuth=Boolean(authUser)
  const isOnboarded=authUser?.isOnboarded

  if(isLoading) return <Loader />

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuth && isOnboarded? (<Layout showSidebar={true} > <Home/> </Layout>) : <Navigate to={ !isAuth? `/login` : "ing" } />  }/>
        <Route path="/signup" element={ !isAuth ? <SignUpPage/> : <Navigate to={ isOnboarded ? "/" : "/ing" }/> } />
        <Route path="/login" element={ !isAuth ? <LoginPage/> : <Navigate to={ isOnboarded ? "/" : "/ing" }/>}/>
        <Route path="/notifications" element={isAuth && isOnboarded? (<Layout showSidebar={true} > <Notification/> </Layout>) : <Navigate to={ !isAuth? `/login` : "ing" } />  }/>
        <Route path="/friends" element={isAuth && isOnboarded? (<Layout showSidebar={true} > <Friends/> </Layout>) : <Navigate to={ !isAuth? `/login` : "ing" } />  }/>
        <Route path="/call/:id" element={ isAuth && isOnboarded ? (<CallPage />) : (<Navigate to={!isAuth ? "/login" : "/ing"} />)}/>
        <Route path="/chat/:id" element={ isAuth && isOnboarded ? (<Layout showSidebar={false}><ChatPage /></Layout>) : (<Navigate to={!isAuth ? "/login" : "/ing"} />) }/>
        <Route path="/ing" element={isAuth? (!isOnboarded ? <OnboardingPage/> : <Navigate to="/" />) :<Navigate to="/login" /> }/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
