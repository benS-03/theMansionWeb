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
 *     500 - All Errors
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
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.post('/', checkJwt, (req,res,next) =>{
    //console.log(req.auth);
    console.log("Authorization Header:", req.headers.authorization);


    next();
}, attachUserDetails, createPost);

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
router.delete('/:postId', checkJwt, ensureAdmin, deletePost )


module.exports = router;