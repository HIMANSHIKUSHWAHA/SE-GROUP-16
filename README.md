FitFriend Documentation

Table of Contents
Introduction
Getting Started
Prerequisites
Installation
Features Overview
Login and Registration
Search Functionality
Dashboard
Chat
Recommendations
Subscriptions
Ratings and Reviews
Payment Gateway
Content Moderation
Live Streaming
Security Measures
Frequently Asked Questions
Troubleshooting
Contact Information

Introduction
Welcome to the Wellness Tracking System, your one-stop solution for all your wellness tracking needs. This documentation is designed to help you get acquainted with the functionalities and features of our system.

Getting Started
Prerequisites
A modern web browser (Google Chrome, Mozilla Firefox, etc.)
Internet Connection
Installation
No installation is needed. Simply navigate to [Wellness Tracking System URL] to get started


Features Overview:
Login and Registration:
To use the system, you'll need to create an account. Use a strong password to ensure secure user authentication. We have two roles users can sign up as: customers or fitness instructors. 


[Login page screenshot here snip when completed] 

Customers have multiple features available to them: 
They can search for fitness professionals based on various criteria like name, username, specialty, location, etc.
They can also search for content based on the mode of instruction, type of workout, and age of content.
They can view calendar that shows their timetable for the day including workouts, meals and sleep cycles.
 They can see their currently enrolled workout plans, their progress, calories burned, and how close they are to reaching their goals.
 They can subscribe to their favorite fitness professionals and receive daily updates or notifications when new content is posted
They have the option to subscribe to premium content which requires payment.

Instructors have a different set of features available to them: 
They can upload and update their fitness content in the form of workout plans, videos, and other instructional materials.
They have a dedicated profile that can be viewed by clients, which can include their specialty, location, and other relevant information.
They can track appointments and upcoming sessions on their calendar.
They have access to metrics such as the number of people viewing their content, allowing them to gauge their reach and effectiveness.
They can subscribe to other professionals to keep abreast of trends or for collaborative opportunities.
Their profile page shows the number of subscribers they have, which can serve as social proof to potential clients.
They have the option to publish paid or premium content, which clients can subscribe to for a fee.
They have the capability to conduct live streaming sessions or classes for their subscribed clients.
Authentication Features Overview
Fitfriend has multiple authentication methods: 
Password Recovery and Encryption: User passwords are stored in a database encrypted, and users will be able to recover and change their passwords. 
OAuth Integration: Users have access to OAuth integration, meaning they will be able to log in using their social media accounts. 
Multi-factor authentication: Users have access to Google authentication. 
JSON Web Tokens for User Sessions: JWT is standard for safely transmitting information between parties as a JSON object. 
HTTPS Encryption: All data transferred over the network will be encrypted. 
Authentication Features Backend EndPoints
POST /login
Description:
This endpoint handles user login functionality. It accepts the user's email and password in the request payload, verifies them against the database, and either initiates a session or returns an error message.

Request Headers:
 Content-Type: application/json

Request Parameters:
None

Request Example

POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword"
}

Response Codes:
200 OK: Successfully authenticated; the user session is initiated.
401 Unauthorized: Authentication failed; the user is not found or the credentials are incorrect.
500 Internal Server Error: An unexpected error occurred during the process.

Response Headers:
Content-Type: application/json
Successful Response Body Example

{
  "success": true,
  "message": "authentication succeeded",
  "user": {
    // User information
  }
}

Failure Response Body Example:
{
  "success": false,
  "message": "authentication failed",
  "info": {
    // Additional information about the failure
  }
}

Errors:
401 Unauthorized: "Authentication failed"
500 Internal Server Error: "An unexpected error occurred"

Implementation Details:
This endpoint uses the Passport authentication library and the local strategy for authentication. Upon successful authentication, a new session for the user is initiated.
b.POST /signup

Description:
This endpoint handles user registration. It accepts the user's email, password, and role in the request payload, and optionally the user's height, weight, and specialization based on the role. It then attempts to create a new user in the database.
Request Headers:

  Content-Type: application/json

Request Parameters:
None

Request Body Schema:

    email (String, required) - Email address of the user.
    password (String, required) - Password of the user.
    role (String, required) - Role of the user ('client' or 'professional').
    height (Number, optional) - Height of the user; required if the role is 'client'.
    weight (Number, optional) - Weight of the user; required if the role is 'client'.
    specialization (String, optional) - Specialization of the user; required if the role is 'professional'.

Request Body Example

{
  "email": "user@example.com",
  "password": "userpassword",
  "role": "client",
  "height": 170,
  "weight": 70
}

Request Example
POST /signup

Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword",
  "role": "client",
  "height": 170,
  "weight": 70
}

Response Codes:

    201 Created: User registered successfully.
    409 Conflict: Email already in use.
    500 Internal Server Error: An unexpected error occurred during the process.

Response Headers:

Content-Type: application/json

Successful Response Body Example:
{
  "message": "User registered successfully",
  "user": {
    "email": "user@example.com",
    "role": "client",
    // other user details...
  }
}

Failure Response Body Example

{
  "message": "Email already in use"
}

Errors:

    409 Conflict: "Email already in use"
    500 Internal Server Error: "An unexpected error occurred"

Implementation Details:
This endpoint uses MongoDB for database operations. Upon successful registration, a new user record is created in the database. The email field is set to be unique, so the database will return an error if an attempt is made to register a duplicate email.
router.post('/passwordReset', authController.passwordReset);

POST /passwordReset

Description:
This endpoint handles password reset functionality for users. It accepts the user's email address and generates a password reset token that is sent to the user's email. The token will expire in 10 minutes.

Request Headers:

               Content-Type: application/json

Request Parameters:
None

Request Body Schema:

    email (String, required): Email address of the user for whom the password needs to be reset.

Request Example:

http

POST /passwordReset
Content-Type: application/json

{
  "email": "user@example.com"
}

Response Codes:

    200 OK: Password reset link successfully sent to the email.
    400 Bad Request: Email is required but was not provided.
    404 Not Found: Email address not found in the database.
    500 Internal Server Error: An unexpected error occurred during the process.

Response Headers:

    Content-Type: application/json

Successful Response Body Example:

json

{
  "status": "success",
  "message": "Password reset link sent to email"
}

Failure Response Body Example:
For 400 Bad Request

json

{
  "message": "Email is required"
}

For 404 Not Found

json

{
  "message": "Email address not found"
}

Errors:

    400 Bad Request: "Email is required"
    404 Not Found: "Email address not found"
    500 Internal Server Error: "An unexpected error occurred"

Implementation Details:
This endpoint generates a unique password reset token using the crypto library and attaches it to the user's database record. The token is sent to the user's email address and expires in 10 minutes.

router.post('/updatePassword', authController.updatePassword);
POST /updatePassword

Description:
This endpoint is used for updating the user's password. It takes a token (sent via email to the user) and a new password in the request payload. It verifies the token, checks its validity, and then updates the user's password.

Request Headers:

	Content-Type: application/json

Request Parameters:
None

Request Body Schema:

	token (String, required): The password reset token sent to the user's email.
	newPassword (String, required): The new password the user wishes to set.

Request Example:

http

POST /updatePassword
Content-Type: application/json

{
  "token": "some-token-from-email",
  "newPassword": "newUserPassword"
}

Response Codes:

	200 OK: Password was successfully updated.
	400 Bad Request: Token and new password are required but were not provided, or the token is invalid or has expired.
	500 Internal Server Error: An unexpected error occurred during the process.

Response Headers:

	Content-Type: application/json

Successful Response Body Example:

json

{
  "status": "success",
  "message": "Password updated successfully"
}

Failure Response Body Example:
For 400 Bad Request with missing token or password

json

{
  "message": "Token and new password are required"
}

For 400 Bad Request with invalid or expired token

json

{
  "message": "Token is invalid or has expired"
}

Errors:

	400 Bad Request: "Token and new password are required" or "Token is invalid or has expired"
	500 Internal Server Error: "An unexpected error occurred"

Implementation Details:
This endpoint verifies the token against the stored resetPasswordToken and resetPasswordExpires fields in the user's database record. If the token is valid and not expired, the user's password is updated, and the resetPasswordToken and resetPasswordExpires fields are cleared.
POST /setup

Description:
This endpoint initiates the setup process for Two-Factor Authentication (2FA) for a user. It generates a 2FA secret and a QR code URL that the user is expected to scan using a 2FA application.

Request Headers:

	Content-Type: application/json

Request Parameters:
None

Request Body Schema:

	user_id (String, required): The authenticated user's ID.

Request Example:

http

POST /setup
Content-Type: application/json

{
  "user_id": "some_user_id_here"
}

Response Codes:

	200 OK: QR code URL successfully generated.
	404 Not Found: User not found.

Response Headers:

	Content-Type: application/json

Successful Response Body Example:

json

{
  "dataUrl": "data:image/png;base64,..."
}

Errors:

	404 Not Found: "User not found"

Implementation Details:
This endpoint generates a 2FA secret using the Speakeasy library. The secret is then stored in the twoFASecret field of the user's database record, and a QR code is generated for the user to scan.
POST /verify

Description:
This endpoint verifies the 2FA token provided by the user.

Request Headers:

	Content-Type: application/json

Request Parameters:
None

Request Body Schema:

	token (String, required): The 2FA token.

Request Example:

http

POST /verify
Content-Type: application/json

{
  "token": "123456"
}

Response Codes:

	200 OK: Token verified successfully.
	400 Bad Request: Invalid token.
	404 Not Found: User not found.

Response Headers:

	Content-Type: application/json

Successful Response Body Example:

json

{
  "message": "Token verified successfully"
}

Failure Response Body Example:

json

{
  "message": "Invalid token"
}

Errors:

	400 Bad Request: "Invalid token"
	404 Not Found: "User not found"

Implementation Details:
This endpoint uses the Speakeasy library to verify the token against the stored twoFASecret field in the user's database record. If the token is verified, a success message is returned.

This documentation should provide a complete overview of how the /setup and /verify endpoints for 2FA work in your system. You can include this in your API documentation for completeness.












		




















reset password
three different views
























Search Functionality
The search functionality allows you to easily find resources, courses, and articles related to your wellness journey.
Dashboard
Once you log in, you'll be directed to your dashboard where you can monitor your wellness metrics and engage with the community.
Chat
Connect with peers and experts through our chat feature to discuss wellness tips, ask questions, and share experiences.
Recommendations
Based on your usage and preferences, the system will recommend articles, courses, and resources that may be of interest to you.
Subscriptions
Subscribe to specific topics or creators within the community to stay updated on the latest content.
Ratings and Reviews
Rate and review courses or resources to help the community make better choices.
Payment Gateway
Our secure payment gateway supports multiple payment options for subscribing to premium content.
Content Moderation
User-generated content goes through a moderation process to ensure the integrity and safety of our community.
Live Streaming
Join live streaming sessions to participate in live discussions and activities related to wellness.

See our FAQ section for answers to common questions related to account management, features, and troubleshooting.


This structure provides a comprehensive guide for users to understand and navigate the Wellness Tracking System. Feel free to expand or modify these sections based on your specific needs.

