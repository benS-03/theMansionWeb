const pool = require('../db/db.js');




async function getReviews(data){

    const { limit = 10, offset = 0} = data;

    const query = `
    SELECT *
    FROM reviews
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);

    return result.rows;
}


async function createReview(data){
    
    const {
        reviewer = 'anonymous',
        score = '-1',
        body = '',
    } = data;

    const query = `
    INSERT INTO reviews (reviewer, score, body)
    VALUES ($1, $2, $3)
    RETURNING *`
    
    const result = await pool.query(query, [reviewer, score, body]);

    return result.rows[0];
}

async function deleteReview(id){
    
    const query = `
    DELETE FROM reviews
    WHERE id = $1
    RETURNING *`;

    const result = await pool.query(query, [id]);

    return result.rows[0];
}


module.exports = {getReviews, createReview, deleteReview};