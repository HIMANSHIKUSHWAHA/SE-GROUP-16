import React, { useState } from "react";
import Header from "../header";
import validator from "validator";
import { postReq } from "../../services/api";
import { Navigate } from "react-router-dom";

export default function ResetPassword(props) {
    
    const [formData, setFormData] = useState({
        email: ""
    });
    const [validEmailErr, setValidEmailErr] = useState(null);
    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value };
        });
        setValidEmailErr(null);
        setNav(null);
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(validator.isEmail(formData.email)){
            
            console.log(formData.email);
            const headers = {};
            const response = await postReq("/auth/passwordReset", headers, formData);
            console.log(response);
            setFormData({
                email: ""
            });

            // Put on a page to saying check email
            
        }else{
            setValidEmailErr("Not a valid email");
        }
    }

    if(nav == null){
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
                        <a className="link-primary" onClick={() => setNav("/login")} href="#">login</a>
                    </div>
                </div>
                </form>
            </div>
        )
    }else{
        return (
            <Navigate to={nav} />
        )
    }
}