const pool = require('../db/db.js');
const {ValidationError, NotFoundError} = require('../errors/errors')




async function getShows(data){

    const { limit = 10, offset = 0} = data;

    if (limit > 100 || limit < 1) throw new ValidationError('Limit must be between 1 and 100')
    if (offset < 0) throw new ValidationError('Offset must be positive number')
    
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

    if (!showDate) throw new ValidationError('Show date required');
    if (!venue) throw new ValidationError('Venue required');
    if (!ticketsUrl) throw new ValidationError('Tickets URL required');
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

    if (!result.rows[0]) throw new NotFoundError(`show with id ${id} not found.`)

    console.log('Show Deleted from DB');

    return result.rows[0];
}


module.exports = {getShows, createShow, deleteShow};