const pool = require('../db/db.js');

const {ValidationError, NotFoundError} = require('../errors/errors')



async function getMPosts(data){

    const {limit = 10, offset = 0} = data;

    if (limit > 100 || limit < 1) throw new ValidationError('Limit must be between 1 and 100')
    if (offset < 0) throw new ValidationError('Offset must be positive number')
    

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
        imageUrl,
        links = []
    } = data;

    if(!title) throw new ValidationError('title is Required');
    if (!imageUrl) throw new ValidationError('imageURL is required');
    if (!Array.isArray(links)) throw new ValidationError('Links must be an array');

    const query = `
    INSERT INTO music_posts (title, image_url, links)
    VALUES ($1, $2, $3::jsonb)
    RETURNING *`;

    const result = await pool.query(query, [title, imageUrl, JSON.stringify(links)]);

    console.log('New MusicPost Saved to DB')
    return result.rows[0];

}

async function deleteMPost(id){
    
    const query = `
    DELETE FROM music_posts
    WHERE id = $1
    RETURNING *`;

    const result = await pool.query(query, [id]);

    if (!result.rows[0]) throw new NotFoundError(`MusicPost with id ${id} not found.`)

    console.log('MusicPost Deleted from DB');

    return result.rows[0]
}


module.exports = {getMPosts, createMPost, deleteMPost};