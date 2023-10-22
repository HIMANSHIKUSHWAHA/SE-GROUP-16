import axios from "axios";

// hosting
axios.defaults.baseURL = "http://34.170.53.225:5000"

// // testing
// axios.defaults.baseURL = "http://localhost:5000"

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
        // throw error;
    }
}

// For email /passwordReset
// for update /updatePassword