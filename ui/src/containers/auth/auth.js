import React, { useState } from "react"
import ClientLogin from "./clientLogin"
import ClientSignup from "./clientSignup"

export default function (props) {
  let [authMode, setAuthMode] = useState("signin")

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  if (authMode === "signin") {
    return (
      <ClientLogin changeAuthMode={changeAuthMode} />
    )
  }else {
    return (
      <ClientSignup changeAuthMode={changeAuthMode} />
    )
  }
}