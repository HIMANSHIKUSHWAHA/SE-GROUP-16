import axios from "axios";

// axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
// console.log("HIHHIHIHHI - ", process.env);

axios.defaults.baseURL = "http://localhost:5000";

export async function postReq(localUrl, headers, data) {
    const fullUrl = "/api/v1" + localUrl;
    try {
        const response = await axios({
            url: fullUrl,
            method: "POST",
            headers: headers,
            data: data,
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getReq(localUrl, headers, params) {
    const fullUrl = "/api/v1" + localUrl;
    try {
        const response = await axios({
            url: fullUrl,
            headers: headers,
            method: "GET",
            params: params,
            // withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("error in get request");
    }
}