// import React, { useState } from "react";
// import Header from "../header";
// import { Navigate } from "react-router-dom";
// import { postReq } from "../../services/api";

// export default function TwoFactor (props) {


//     // const [data,setCode] = useState({
//     //     code: null,
//     //     token: null
//     // });

//     const [code, setCode] = useState(null);
//     const [nav, setNav] = useState(null);

//     const handleInputChange = (event) => {
//         setCode(event.target.value);
//     }

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const data = {
//             code: code,
//             token: localStorage.getItem("token")
//         }

//         console.log(data);
//         const headers = {};
//         const response = await postReq("/auth/2fa/verify", headers, data);

//         if (response.message == "Token verified successfully"){
//             setNav("/dashboard");
//         }else{
//             console.log("Error");
//         }
//     }

//     if (nav == null) {

//         return (
//             <div className="Auth-form-container">
//                 <Header />
//                 <form className="Auth-form" onSubmit={handleSubmit}>
//                     <div className="Auth-form-content">
//                         <h3 className="Auth-form-title">Enter the code</h3>
//                         {/* <div className="text-center">
//                             Not registered yet?{" "}
//                             <a className="link-primary" onClick={() => setNav("/signup")} href="#">Sign Up</a>
//                         </div> */}
//                         <div className="form-group mt-3">
//                             <label>code</label>
//                             <input
//                                 type="number"
//                                 className="form-control mt-1"
//                                 placeholder=""
//                                 name="code"
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                         <div className="d-grid gap-2 mt-3">
//                             <button type="submit" className="btn btn-primary">
//                                 submit
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         )
//     } else {

//         return (
//             <Navigate to={nav} />
//         )
//     }
// }

import React, { useState } from "react";
import Header from "../header";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postReq } from "../../services/api";
import { Navigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function TwoFactor(props) {
    const [code, setCode] = useState(null);
    const [nav, setNav] = useState(null);

    const handleInputChange = (event) => {
        setCode(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            code: code,
            token: localStorage.getItem("token")
        }

        const headers = {};
        const response = await postReq("/auth/2fa/verify", headers, data);

        if (response.message === "Token verified successfully") {
            localStorage.removeItem("token");
            localStorage.setItem("token", response.token)
            setNav("/dashboard");
        } else {
            console.log("Error");
        }

        console.log(response)
    }

    if (nav) {
        return <Navigate to={nav} />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Header />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div
                    style={{
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Enter the 2FA Code
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '8px' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="code"
                            label="2FA Code"
                            name="code"
                            autoFocus
                            type="number"
                            value={code}
                            onChange={handleInputChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ margin: '24px 0 16px' }}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </Container>
        </ThemeProvider>
    );
}