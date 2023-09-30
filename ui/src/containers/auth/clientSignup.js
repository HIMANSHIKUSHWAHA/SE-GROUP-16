import React, { useState } from "react";
import Header from "../header";
import validator from "validator";
import { postClientSignUp } from "../api";

export default function ClientSignup(props) {
    
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        role:"",
        email:"",
        password:"",
        rePassword:""
    });
    
    const [err, setErr] = useState({
        roleErr:null,
        validEmailErr:null,
        passStrengthErr: null,
        samePassErr:null
    })


    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => {
            return {...prevFormData, [name]: value};
        });
        setErr({
            roleErr:null,
            validEmailErr:null,
            passStrengthErr: null,
            samePassErr:null
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);     
        if(formData.role === ""){
            setErr((prevErr) => {
                return {...prevErr, "roleErr": "Please select a role"};
            });
        }else{
            if(validator.isEmail(formData.email)){
                if(validator.isStrongPassword(formData.password, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })){
                    if(formData.password === formData.rePassword){
                        postClientSignUp(formData);
                    }else{
                        setErr((prevErr) => {
                            return {...prevErr, "samePassErr":"The passwords does not match"};
                        });
                    }
                }else {
                    setErr((prevErr) => {
                        return {...prevErr, "passStrengthErr": "Password should contain atleast 8 characters \n 1 lowercase letter \n 1 uppercase letter \n 1 numeric value and 1 symbol"};
                    });
                }
            }else {
                setErr((prevErr) => {
                    return {...prevErr, "validEmailErr":"Not a valid email"};
                });
            }
        }
    };

    return (
        <div className="Auth-form-container">
            <Header />
            <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="text-center">
                        Already registered?{" "}
                        <a className="link-primary" onClick={props.changeAuthMode} href="#">Login</a>
                    </div>
                    <div className="form-group mt-3">
                        <label>First Name</label>
                        <input
                        type="text"
                        className="form-control mt-1"
                        placeholder="e.g Rohit"
                        name="firstName"
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Last Name</label>
                        <input
                        type="text"
                        className="form-control mt-1"
                        placeholder="e.g Sharma"
                        name="lastName"
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>How do you want to Sign Up</label>
                        <select 
                          className="form-control mt-1"
                          name="role"
                          value={formData.role} 
                          onChange={handleInputChange}
                        >
                          <option value="">select a role</option>
                          <option value="client">Client</option>
                          <option value="professional">Professional</option>
                        </select>
                    </div>
                    {err.roleErr === null ? null :
                    <span style={{
                        color: 'darkred',
                        fontSize: 13,
                    }}>{err.roleErr}</span>}
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
                    {err.validEmailErr === null ? null :
                    <span style={{
                        color: 'darkred',
                        fontSize: 13,
                    }}>{err.validEmailErr}</span>}
                    <div className="form-group mt-3">
                        <label>New Password</label>
                        <input
                        type="password"
                        className="form-control mt-1"
                        placeholder="Password"
                        name="password"
                        onChange={handleInputChange}
                        />
                    </div>
                    {err.passStrengthErr === null ? null :
                    <span style={{
                        color: 'darkred',
                        fontSize: 13,
                    }}>{err.passStrengthErr}</span>}
                    <div className="form-group mt-3">
                        <label>Confirm Password</label>
                        <input
                        type="password"
                        className="form-control mt-1"
                        placeholder="Comfirm Password"
                        name="rePassword"
                        onChange={handleInputChange}
                        />
                    </div>
                    {err.samePassErr === null ? null :
                    <span style={{
                        color: 'darkred',
                        fontSize: 13,
                    }}>{err.samePassErr}</span>}
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                        Sign me up!!
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