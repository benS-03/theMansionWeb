const pool = require('../db/db');


async function saveChat(data) {

    const {auth0Id, message, username } = data;

    const query = `
    INSERT INTO chats (auth0_id, chat_message, username)
    VALUES ($1, $2, $3)
    RETURNING *`;

    const result = await pool.query(query, [auth0Id, message, username]);


    return result.rows[0];
    
}

module.exports = {saveChat};