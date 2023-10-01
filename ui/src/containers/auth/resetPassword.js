import React, { useState } from "react";
import Header from "../header";
import validator from "validator";
import { postReq } from "../api";

export default function ResetPassword(props) {
    
    const [email, setEmail] = useState(null);
    const [validEmailErr, setValidEmailErr] = useState(null);

    const handleInputChange = (event) => {
        setEmail(event.target.value);
        setValidEmailErr(null);
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if(validator.isEmail(email)){
            
            console.log(email);
            const headers = {};
            postReq("/auth/passwordReset", headers, email);
            setEmail(null);
            
        }else{
            setValidEmailErr("Not a valid email");
        }
    }

    return (
        <div className="Auth-form-container">
            <Header />
            <form className="Auth-form" onSubmit={handleSubmit}>
            <div className="Auth-form-content">
                <h3 className="Auth-form-title">Reset Password</h3>
                <div className="form-group mt-3">
                    <label>Email address</label>
                    <input
                        type="text"
                        className="form-control mt-1"
                        placeholder="e.g abcd@example.com"
                        name="email"
                        onChange={handleInputChange}
                    />
                </div>
                {validEmailErr === null ? null :
                    <span style={{
                        color: 'darkred',
                        fontSize: 13,
                    }}>{validEmailErr}</span>}
                <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">
                    Request an email
                    </button>
                </div>
                <div className="text-center">
                    <a className="link-primary" onClick={() => props.changeAuthMode("login")} href="#">login</a>
                </div>
            </div>
            </form>
        </div>
    )
}