import React, { useState } from 'react'
import {ShipWheelIcon} from "lucide-react"

const SignUpPage = () => {

  const [signupData,setSignupData]=useState({fullName:"",email:"",password:""});

  const handleSignup=(e)=>{
    e.preventDefault()
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest" >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overfloe-hidden">
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">Chatapp</span>
          </div>
          <div className="w-full">
            <form onSubmit={handleSignup} >
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default SignUpPage