import React, { useState } from "react";
import Header from "../header";
import validator from "validator";
import { postReq } from "../../services/api";
import { Navigate } from "react-router-dom";
import { setAuthenticationStat } from "../../services/auth";
import GoogleOAuth from "./oAuth";

export default function ClientLogin(props) {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [validEmail, setValidEmail] = useState(null);
    const [passErr, setPassErr] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value };
        });

        setValidEmail(null);
        setPassErr(null);
        setNav(null);
    };

    const [nav, setNav] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);

        if (validator.isEmail(formData.email)) {

            const headers = {};
            const response = await postReq("/auth/login", headers, formData);
            
            setFormData({
                email: "",
                password: ""
            });

            if (response.message === "authentication succeeded") {

                localStorage.setItem("token", response.tempToken);
                setNav("/2fa")

            } else if (response.message === "authentication failed") {

                setAuthenticationStat(false);
                setPassErr("Incorrect email or password");

            }
        } else {
            setValidEmail("Not a valid email");
        }
    };

    if (nav == null) {

        return (
            <div className="Auth-form-container">
                <Header />
                <form className="Auth-form" onSubmit={handleSubmit}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Login</h3>
                        <div className="text-center">
                            Not registered yet?{" "}
                            <a className="link-primary" onClick={() => setNav("/signup")} href="#">Sign Up</a>
                        </div>
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
                        {validEmail === null ? null :
                            <span style={{
                                color: 'darkred',
                                fontSize: 13,
                            }}>{validEmail}</span>}
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter password"
                                name="password"
                                onChange={handleInputChange}
                            />
                        </div>
                        {passErr === null ? null :
                            <span style={{
                                color: 'darkred',
                                fontSize: 13,
                            }}>{passErr}</span>}
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Login!
                            </button>
                        </div>
                        <GoogleOAuth />
                        <p className="text-center mt-2">
                            <a className="link-primary" onClick={() => setNav("/reset-password")} href="#">Forgot Password?</a>
                        </p>
                    </div>
                </form>
            </div>
        )
    } else {

        return (
            <Navigate to={nav} />
        )
    }
}