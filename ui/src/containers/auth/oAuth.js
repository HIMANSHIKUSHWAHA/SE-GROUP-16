import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


export default function GoogleOAuth () {

    // Write a conditional render for login and signup 

    const handleSubmit = () => {

    }

    return (
        <div className="">
          <div className="">
            <GoogleOAuthProvider 
                clientId={`${process.env.GOOGLE_O_AUTH_CLIENT_ID}`}
                >
             <GoogleLogin
                render={() => (
                    <button
                    type="button"
                    className=""
                    onClick={handleSubmit}
                    // disabled={renderProps.disabled}
                    >
                        Sign in with google
                    </button>
                )}
                // onSuccess={responseGoogle}
                // onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
             />
            </GoogleOAuthProvider>
          </div>
        </div>
    )
}