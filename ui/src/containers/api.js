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

export function postClientLogin(formData) {
    axios({
        url: "http://localhost:5000/api/v1/auth/login",
        method: "POST",
        headers: {

        },
        data: formData,
    }).then((res) => {
        console.log(res);
    }).catch((err) => (console.log(err)));
}

export function postReq (localUrl, headers, data) {

    const fullUrl = "http://localhost:5000/api/v1" + localUrl;
    axios({
        url: fullUrl,
        method: "POST",
        headers: headers,
        data: data,
    }).then((res) => {
        console.log(res);
        return JSON.stringify(res.data)
    }).catch((err) => (console.log(err)));
}

// For email /passwordReset
// for update /updatePassword