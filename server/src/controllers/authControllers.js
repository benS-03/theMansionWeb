const axios = require('axios');

const authSerices = require('../services/authServices');
const { auth } = require('express-oauth2-jwt-bearer');

async function login(req, res) {
    
    const {username, password} = req.body;

    try {

        const response = await axios.post(
            `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            {
                grant_type: "password",
                username: username,
                password: password,

                connection: "Username-Password-Authentication",
                audience: process.env.AUTH0_AUDIENCE,
                scope: "openid",

                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        res.json(response.data.access_token);

    } catch (err) {

    console.log("\n===== AUTH0 FULL DEBUG =====");

    if (err.response) {

        console.log("Status:", err.response.status);

        console.log("\nError Data:");
        console.dir(err.response.data, { depth: null });

        console.log("\nRequest Config:");
        console.log(err.config);

    } else {
        console.log("Error Message:", err.message);
    }

    res.status(401).json({
        error: "Invalid Credentials",
        debug: err.response?.data || err.message
    });
}

}

async function register(req, res) {

    try {
        const {username, password, email} = req.body;

        const user = await authSerices.registerUser({username, password, email});
        
        const savedUser = await authSerices.saveUserToDb({username: user.username, email:user.email, role: "admin", auth0Id: user.user_id })

        res.json(savedUser);
    } catch (err) {
        console.log(err.response?.data || err.message)

        res.status(500).json({
            error: "Registration failed"
        });
    }
}

module.exports = {login, register};