const admin = require('firebase-admin');

exports.login = async (req, res) => {
    // Assuming the token is sent in the Authorization header
    const idToken = req.headers.authorization;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // After verifying the token, you can get the user's UID and other claims
        const uid = decodedToken.uid;
        // Here, you can also check the user's role or any other conditions if necessary
        // TODO check roles

        res.status(200).json({ message: 'Login successful', uid });
    } catch (error) {
        res.status(500).json({ message: 'Token verification failed', error: error.message });
    }
};
