import React, { useState } from "react";
import Header from "../header";
import validator from "validator";
import { postClientSignUp } from "../api";

export default function ClientSignup(props) {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        role: "client",
        email: "",
        password: "",
        rePassword: ""
    });

    const [strengthMessage, setStrengthMessage] = useState(null);
    const [samePass, setSamePass] = useState(null);
    const [validEmail, setValidEmail] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return { ...prevFormData, [name]: value };
        });
        setStrengthMessage(null);
        setSamePass(null);
        setValidEmail(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);

        if (validator.isEmail(formData.email)) {
            if (validator.isStrongPassword(formData.password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })) {
                if (formData.password === formData.rePassword) {
                    postClientSignUp(formData);
                } else {
                    setSamePass("The passwords does not match");
                }
            } else {
                setStrengthMessage("Password should contain atleast 8 characters \n 1 lowercase letter \n 1 uppercase letter \n 1 numeric value and 1 symbol");
            }
        } else {
            setValidEmail("Not a valid email");
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
                            <option value="client">Client</option>
                            <option value="professional">Professional</option>
                        </select>
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
                        <label>New Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                        />
                    </div>
                    {strengthMessage === null ? null :
                        <span style={{
                            color: 'darkred',
                            fontSize: 13,
                        }}>{strengthMessage}</span>}
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
                    {samePass === null ? null :
                        <span style={{
                            color: 'darkred',
                            fontSize: 13,
                        }}>{samePass}</span>}
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