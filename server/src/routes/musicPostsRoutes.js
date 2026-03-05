const express = require('express');
const router = express.Router();const ensureAdmin = require('../middleware/ensureAdmin')
const {getMusicPosts, createMusicPost, deleteMusicPost} = require('../controllers/musicPostControllers')
const checkJwt = require('../middleware/auth');

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
router.get('/', getMusicPosts);

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
router.post('/', checkJwt, ensureAdmin, createMusicPost);

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
router.delete('/:postId', checkJwt, ensureAdmin, deleteMusicPost )


module.exports = router;