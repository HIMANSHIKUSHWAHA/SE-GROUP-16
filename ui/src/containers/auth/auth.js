import React, { useState } from "react"
import Login from "./login"
import Signup from "./signup/signup"
import ResetPassword from "./resetPassword"
import UpdatePassword from "./updatePassword"

export default function (props) {
  let [authMode, setAuthMode] = useState("login")

  const changeAuthMode = (mode) => {
    setAuthMode(mode);
  }

  if (authMode === "login") {
    return (
      <Login changeAuthMode={changeAuthMode} />
    )
  } else if (authMode === "signup") {
    return (
      <Signup changeAuthMode={changeAuthMode} />
    )
  } else if (authMode === "reset password") {
    return (
      <ResetPassword changeAuthMode={changeAuthMode} />
    )
  } else if (authMode === "update password") {
    return (
      <UpdatePassword />
    )
  }
}