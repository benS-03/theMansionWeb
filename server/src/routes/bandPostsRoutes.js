const express = require('express');
const router = express.Router();
const {getPosts, createPost, deletePost} = require('../services/bandPostsServices')
const ensureAdmin = require('../middleware/ensureAdmin');
const e = require('express');


/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for getting paginated list of band posts
 *     orderd by time created descending.
 *
 * Route:
 *     GET /band_posts
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
 *     JSON of posts
 *
 * Errors:
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.get('/', async (req, res) => {
    
    try {
        const posts = await getPosts({
            limit: Number(req.query.limit),
            offset: Number(req.query.offset)
        })

        res.status(200).json(posts)
    }catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
});

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for adding a band post to the DB
 *
 * Route:
 *     POST /band_posts
 *
 * Route Params:
 *     None
 *
 * Query Params:
 *     None
 *
 * Request Body:
 *     Content and Data for post, seen in func
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
            postType,
            title,
            body,
            imageUrl
        
        } = req.body;

        const result = await createPost({
            postType: postType,
            title: title,
            body: body,
            imageUrl: imageUrl
        });

        res.status(201).json(result);
    }catch (err) {
    res.status(500).json({
        error: err.message
    });
    }
});

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for deleting a band post from the DB
 *
 * Route:
 *     DELETE /band_posts/:postId
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
        const result = await deletePost(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
    res.status(500).json({
        error: err.message
    });
    }
})