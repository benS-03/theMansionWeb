const pool = require('../db/db.js');


async function saveChat(data) {

    const {auth0Id, message } = data;

    const query = `
    INSERT INTO chats (auth0_id, chat_message
    VALUES ($1, $2)
    RETURNING *`;

    const result = pool.query(query, {auth0Id, message});


    return result.rows[0];
    
}

module.exports = { saveChat};