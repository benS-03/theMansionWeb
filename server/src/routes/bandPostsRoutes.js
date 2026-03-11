const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin');
const {getPosts, createPost, deletePost} = require('../controllers/bandPostControllers');
const checkJwt = require('../middleware/auth');
const attachUserDetails = require("../middleware/attachUserDetails")
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
 *     400 - Validation Errors: Invalid limit or Offset
 * ------------------------------------------------------------
 */
router.get('/',getPosts);

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
 *     400 - Validation Errors: missing post type, title, or body
 *     401 - Unauthorized
 *     403 - Forbidden
 * ------------------------------------------------------------
 */
router.post('/', checkJwt, attachUserDetails, ensureAdmin, createPost);

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
 *     400 - NotFoundError: couldnt delete db with provided ID
 *     401 - Unauthorized
 *     403 - Forbidden
 * ------------------------------------------------------------
 */
router.delete('/:postId', checkJwt, attachUserDetails, ensureAdmin, deletePost )


module.exports = router;