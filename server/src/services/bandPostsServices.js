const pool = require('../db/db.js');




async function getPosts(data){

    const { limit = 10, offset = 0} = data;

    const query = `
    SELECT *
    FROM band_posts
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);

    return result.rows;

}


async function createPost(data){

    const {
        postType,
        title,
        body,
        imageUrl = '',
    } = data;

    const query = `
    INSERT INTO band_posts (post_type, title, body, image_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `

    const result = await pool.query(query, [postType, title, body, imageUrl]);

    return result.rows[0];    
}

async function deletePost(id){
    
    const query = `
    DELETE FROM band_posts
    WHERE id = $1
    RETURNING *`;

    const result = await pool.query(query, [id]);
    console.log("Created Band Post: ", result.rows[0]);
    return result.rows[0];
}


module.exports = {getPosts, createPost, deletePost};