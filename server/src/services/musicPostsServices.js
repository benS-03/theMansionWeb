const pool = require('../db/db.js');




async function getMPosts(data){

    const {limit = 10, offset = 0} = data;

    const query = `
    SELECT *
    FROM music_posts
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2`;

    const result = await pool.query(query, [limit, offset]);

    return result.rows;
}


async function createMPost(data){
    
    const {
        title,
        image_url,
        links = []
    } = data;

    const query = `
    INSERT INTO music_posts (title, image_url, links)
    VALUES ($1, $2, $3)
    RETURNING *`;

    const result = await pool.query(query, [title, image_url, JSON.stringify(links)]);

    return result.rows[0];

}

async function deleteMPost(id){
    
    const query = `
    DELETE FROM music_posts
    WHERE id = $1
    RETURNING *`;

    const result = await pool.query(query, [id]);

    return result.rows[0];
}


module.exports = {getMPosts, createMPost, deleteMPost};