const axios = require("axios");
const pool = require('../db/db.js');

async function getManagementToken() {

    const response = await axios.post(
        `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        {
            grant_type: "client_credentials",
            client_id: process.env.AUTH0_M2M_CLIENT_ID,
            client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
            audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return response.data.access_token;
}

async function registerUser(data){

    const {username, email, password} = data;

    const token = await getManagementToken();

    const response = await axios.post(
               `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
        {
            connection: "Username-Password-Authentication",
            username: username,
            email: email,
            password: password
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
}

async function saveUserToDb(data) {

    const {username, role, auth0Id, email} = data;

    const query = `
    INSERT INTO users ( username, user_role, email, auth0_id )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `

    const result = await pool.query(query, [username, role, email, auth0Id]);

    return result.rows[0];


}


async function getUserWithAuth0(auth0Id) {

    const query = `
    SELECT * FROM users
    WHERE auth0_id = $1
    `
    const result = await pool.query(query, [auth0Id]);

    return result.rows[0];
    
}

module.exports = { getUserWithAuth0, getManagementToken, registerUser, saveUserToDb };

