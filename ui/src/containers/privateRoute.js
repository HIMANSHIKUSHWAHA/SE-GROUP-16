import React from "react";
import { Navigate } from "react-router-dom";
import { authencationStat } from "../services/auth";

export default function PrivateRoute ({children}) {

    const isLoggedIn = authencationStat();

    if(isLoggedIn){
        return children;
    }else{
        return <Navigate to="/login" />
    }
};