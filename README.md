# Team-16-CSCI-P465-565
Fall 2023 CSCI-P465/565 Team 16 Project Repository

## Front-End 

Routes 
-> "/login" for all the login pages for now
    -> Will change to different UI for different roles.
    -> Or just one UI and take role as argument.

-> "/signin" for all the signin pages for now
    -> Will change to different UI for different roles.
    -> Or just one UI and take role as argument.

-> "/reset-password" reset password, will ask for an email.

->  "/update-password" will ask for new password.

-> "/dashboard" for the one and only dashboard as of now.
    -> Protected route.

Structures
-> login
    --> The form structure
        {
            email: "",
            password: ""
        }, setFormData
    --> email error variable name: validEmail, setValidEmail
    --> password error variable name: passErr, setPassErr
    --> Will probably combine them into one structure
        {
            validEmail: "",
            passErr: ""
        }, setErr

-> signup
    --> The form structure
        {
            firstName: "",
            lastName: "",
            role: "",
            email: "",
            password: "",
            rePassword: ""
        }, setFormData
    --> Err structure
        {
            roleErr: null,
            validEmailErr: null,
            passStrengthErr: null,
            samePassErr: null
        },setErr

## Back-End