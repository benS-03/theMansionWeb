const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin')
const {getReviews, createReview, deleteReview} = require('../controllers/reviewControllers')
const checkJwt = require('../middleware/auth');
const attachUserDetails = require("../middleware/attachUserDetails")

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for getting paginated list of reviews
 *     orderd by time created descending.
 *
 * Route:
 *     GET /reviews
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
 *     JSON of reviews
 *
 * Errors:
 *     400 - Validation Errors: Invalid limit or Offset
 * ------------------------------------------------------------
 */
router.get('/', getReviews);

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for adding a review to the DB
 *
 * Route:
 *     POST /reviews
 *
 * Route Params:
 *     None
 *
 * Query Params:
 *     None
 *
 * Request Body:
 *     Content and Data for review, 
 *          {
 *              reviewer = 'anonymous',
 *              score = -1,
 *              body = ''
 *          }
 *
 * Returns:
 *     JSON containing inserted row.
 *
 * Errors:
 *     None
 * ------------------------------------------------------------
 */
router.post('/', createReview);

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for deleting a review from the DB
 *
 * Route:
 *     DELETE /reviews/:reviewId
 *
 * Route Params:
 *     reviewId: primary key id for review
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
router.delete('/:postId', checkJwt, ensureAdmin, deleteReview)


module.exports = router;