import axios from "axios";

export function postClientSignUp(formData) {
    axios({
        url: "http://localhost:5000/api/v1/auth/signup",
        method: "POST",
        headers: {
            
        },
        data: formData,
    }).then((res) => {
           
    }).catch((err) => (console.log(err)));
}

export function postClientLogin(formData){
    axios({
        url: "http://localhost:5000/api/v1/auth/login",
        method: "POST",
        headers: {
            
        },
        data: formData,
    }).then((res) => {

    }).catch((err) => (console.log(err)));
}