import React, { useState } from "react";
import Header from "../header";
import validator from "validator";
import { postClientLogin } from "../api";

export default function ClientLogin(props){

    const [formData, setFormData] = useState({
        email:"",
        password:""
    });

    const [validEmail, setValidEmail] = useState(null);

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => {
            return {...prevFormData, [name]: value};
        });

        setValidEmail(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        
        if(validator.isEmail(formData.email)){
            postClientLogin(formData);
        }else{
            setValidEmail("Not a valid email");
        }
    };

    return (
        <div className="Auth-form-container">
            <Header />
            <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Login</h3>
                    <div className="text-center">
                        Not registered yet?{" "}
                        <a className="link-primary" onClick={props.changeAuthMode} href="#">Sign Up</a>
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
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                        Login!
                        </button>
                    </div>
                    <p className="text-center mt-2">
                        <a href="#">Forgot Password?</a>
                    </p>
                </div>
            </form>
        </div>
    )
}