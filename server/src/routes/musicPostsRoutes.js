const express = require('express');
const router = express.Router();
const {getMPosts, createMPost, deleteMPost} = require('../services/musicPostsServices')
const ensureAdmin = require('../middleware/ensureAdmin')




/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for getting paginated list of music posts
 *     orderd by time created descending.
 *
 * Route:
 *     GET /music_posts
 *
 * Route Params:
 *     None
 *
 * Query Params:
 *     limit: pagination limit (DEFAULT: 10)
 *     offset: pagination offset (DEAFULT: 0)
 *
 * Request Body:
 *     None
 *
 * Returns:
 *     JSON of music posts
 *
 * Errors:
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.get('/', async (req, res) => {
    
    try {
        const posts = await getMPosts({
            limit: Number(req.query.limit),
            offset: Number(req.query.offset)
        })

        res.status(200).json(posts)
    } catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
});

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for adding a music post to the DB
 *
 * Route:
 *     POST /music_posts
 *
 * Route Params:
 *     None
 *
 * Query Params:
 *     None
 *
 * Request Body:
 *     Content and Data for post, ******NOT DEFINED YET******
 *
 * Returns:
 *     JSON containing inserted row.
 *
 * Errors:
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.post('/', ensureAdmin, async (req, res) => {

    try {
        const {
            title,
            imageUrl,
            links
        } = req.body;

        const result = await createMPost({title,  imageUrl, links});

        res.status(201).json(result);
    } catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
});

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for deleting a music post from the DB
 *
 * Route:
 *     DELETE /music_posts/:postId
 *
 * Route Params:
 *     postId: primary key id for post
 *
 * Query Params:
 *     None
 *
 * Request Body:
 *     None
 *
 * Returns:
 *     JSON containing delete confirmation.
 *
 * Errors:
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.delete('/:postId', ensureAdmin, async (req, res) => {

    try {
        const result = await deleteMPost(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
})