import React, { useState } from "react";
import { authencationStat } from "../services/auth";
import { Navigate } from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(authencationStat());
    const [nav,setNav] = useState(null);

    const handleButton = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(authencationStat());
        setNav("/login");
    }

    if(nav === null){
        if (isLoggedIn){
            return (
                <div className="header">
                    <div className="header-title">FITFRIEND</div>
                    {/* <div className="user-details">User Details Placeholder</div> */}
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={handleButton}>
                            Logout
                        </button>
                    </div>
                </div>
            );
        }else{
            return (
                <div className="header">
                    <div className="header-title">FITFRIEND</div>
                    {/* <div className="user-details">User Details Placeholder</div> */}
                </div>
            );
        }
    }else{
        return (
            <Navigate to={nav} />
        )
    }
}
