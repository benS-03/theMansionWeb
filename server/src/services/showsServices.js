const pool = require('../db/db.js');




async function getShows(data){

    const { limit = 10, offset = 0} = data;

    const query = `
    SELECT *
    FROM shows
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);

    return result.rows;
}


async function createShow(data){
   
    const {
        showDate,
        venue,
        venueUrl,
        ticketsUrl
    } = data

    const query = `
    INSERT INTO shows (show_date, venue, venue_url, tickets_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *`

    const result = await pool.query(query, [new Date(showDate), venue, venueUrl, ticketsUrl]);

    return result.rows[0];
}

async function deleteShow(id){
    
    const query = `
    DELETE FROM shows
    WHERE id = $1
    RETURNING *`

    const result = await pool.query(query, [id]);

    return result.rows[0];
}


module.exports = {getShows, createShow, deleteShow};