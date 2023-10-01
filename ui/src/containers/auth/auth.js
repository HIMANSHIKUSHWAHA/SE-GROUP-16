import React, { useState } from "react"
import ClientLogin from "./clientLogin"
import ClientSignup from "./clientSignup"
import ResetPassword from "./resetPassword"
import UpdatePassword from "./updatePassword"

export default function (props) {
  let [authMode, setAuthMode] = useState("login")

  const changeAuthMode = (mode) => {
    setAuthMode(mode);
  }

  if (authMode === "login") {
    return (
      <ClientLogin changeAuthMode={changeAuthMode} />
    )
  }else if(authMode === "signup"){
    return (
      <ClientSignup changeAuthMode={changeAuthMode} />
    )
  }else if(authMode === "reset password"){
    return (
      <ResetPassword changeAuthMode={changeAuthMode} />
    )
  }else if(authMode === "update password"){
    return (
      <UpdatePassword />
    )
  }
}