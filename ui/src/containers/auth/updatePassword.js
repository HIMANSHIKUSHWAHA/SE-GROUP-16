import React, {useState} from "react";
import Header from "../header";
import validator from "validator";
import { postReq } from "../../services/api";
import { useSearchParams, Navigate } from "react-router-dom";

export default function UpdatePassword (props) {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [formData, setFormData]  = useState({
        newPassword: "",
        confirmPassword: "",
        token: searchParams.get("__upt")
    });

    const [err, setErr] = useState({
        passStrengthErr: null,
        samePassErr: null
    });

    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return {...prevFormData, [name]: value};
        });
        setErr({
            passStrengthErr: null,
            samePassErr: null
        });
    }

    const handleSubmit = async (event) => {
        
        event.preventDefault();
        console.log(formData);
        if(validator.isStrongPassword(formData.newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })){
            if(formData.newPassword === formData.confirmPassword){

                const headers = {};
                const response = await postReq("/auth/updatePassword", headers, formData);

                console.log(response)

                setNav("/login");
            }else{
                setErr((prevErr) => {
                    return { ...prevErr, "samePassErr": "The passwords does not match" };
                });
            }
        }else{
            setErr((prevErr) => {
                return { ...prevErr, "passStrengthErr": "Password should contain atleast 8 characters \n 1 lowercase letter \n 1 uppercase letter \n 1 numeric value and 1 symbol" };
            });
        }
    }

    if(nav == null){
        return (
            <div className="Auth-form-container">
                <Header />
                <form className="Auth-form" onSubmit={handleSubmit}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Update Password</h3>
                        <div className="form-group mt-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Password"
                                name="newPassword"
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
                                name="confirmPassword"
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
                                Update!
                            </button>
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