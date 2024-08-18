const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    // Get user data from JWT Token and add id in req object
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using valid token" });
    }
    try {
        // Verify the token and JWT_SECRET
        const data = jwt.verify(token, JWT_SECRET);
        // console.log('Decoded token data:', data); // Log the decoded token data for debugging
        req.user = data.user;
        if (!req.user || !req.user.id) {
            return res.status(401).send({ error: "Invalid token data" });
        }
        // next() means after this middleware function runs, proceed to the next callback function ↓
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using valid token" });
    }
}

module.exports = fetchuser;