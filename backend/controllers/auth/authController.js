const admin = require('firebase-admin');
const AppError = require('../../middlewareAppError')

//POST request from front end with firebase token
const login = async (req, res) => {
    // Assuming the token is sent in the Authorization header
    const idToken = req.headers.authorization;

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // After verifying the token, you can get the user's UID and other claims
    const uid = decodedToken.uid;
    // Here, you can also check the user's role or any other conditions if necessary
    // TODO Check if role is correct or not
    // Retrieve the user's role. 
    // This assumes you have a Firestore collection named 'users' 
    // where each document's ID is the user's UID and each document 
    // has a field named 'role' which specifies the user role.

    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
        return next(new AppError('User not found', 404));
    }

    const { role } = userDoc.data();
    // Return the role to the frontend
    res.status(200).json({ message: 'Login successful', role });
};


//POST request from Frontend with email, password and role
const signup = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password
        });

        // Store additional user data in Firestore 
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            role: role,
            // ... any other data to store ...
        });

        // Send back a success response
        res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });


    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
}


module.exports = {
    login,
    signup
}