const pool = require('../db/db.js');
const {ValidationError, NotFoundError} = require('../errors/errors')




async function getPosts(data){

    const { limit = 10, offset = 0} = data;
    
    if (limit > 100 || limit < 1) throw new ValidationError('Limit must be between 1 and 100')
    if (offset < 0) throw new ValidationError('Offset must be positive number')
    
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

    if (!postType) throw new ValidationError('postType is required');
    if (!title) throw new ValidationError('title is required');
    if (!body) throw new ValidationError('body is required');

    const query = `
    INSERT INTO band_posts (post_type, title, body, image_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `

    const result = await pool.query(query, [postType, title, body, imageUrl]);

    console.log('New BandPost added to DB');

    return result.rows[0];    
}

async function deletePost(id){
    
    const query = `
    DELETE FROM band_posts
    WHERE id = $1
    RETURNING *`;

    const result = await pool.query(query, [id]);
    
    if (!result.rows[0]) throw new NotFoundError(`Post with id ${id} not found.`)

    console.log('BandPost Deleted from DB');

    return result.rows[0];
}


module.exports = {getPosts, createPost, deletePost};