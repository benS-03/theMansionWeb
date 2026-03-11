const express = require('express');
const router = express.Router();const ensureAdmin = require('../middleware/ensureAdmin')
const {getMusicPosts, createMusicPost, deleteMusicPost} = require('../controllers/musicPostControllers')
const checkJwt = require('../middleware/auth');
const attachUserDetails = require('../middleware/attachUserDetails');
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
 *     400 - Validation Errors: Invalid limit or Offset
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
 *     Content and Data for post,
 *      {
 *          title,
 *          imageUrl,
 *          links = []
 *      }
 *
 * Returns:
 *     JSON containing inserted row.
 *
 * Errors:
 *    400 - Validation Errors: title or imageUrl missing or links not a list
 *    401 - Unauthorized
 *    403 - Forbidden
 * ------------------------------------------------------------
 */
router.post('/', checkJwt, attachUserDetails, ensureAdmin, createMusicPost);

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
 *     404 - Not Found
 *     401 - Unauthorized
 *     403 - Forbidden
 * ------------------------------------------------------------
 */
router.delete('/:postId', checkJwt, ensureAdmin, deleteMusicPost )


module.exports = router;