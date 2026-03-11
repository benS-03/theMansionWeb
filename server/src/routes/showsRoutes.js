const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin')
const {getShows, createShow, deleteShow} = require('../controllers/showControllers')
const checkJwt = require('../middleware/auth');
const attachUserDetails = require('../middleware/attachUserDetails')
/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for getting paginated list of shows
 *     orderd by time created descending.
 *
 * Route:
 *     GET /shows
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
 *     JSON of shows
 *
 * Errors:
 *     400 - Validation Errors: Invalid limit or Offset
 * ------------------------------------------------------------
 */
router.get('/', getShows);

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for adding a show to the DB
 *
 * Route:
 *     POST /show
 *
 * Route Params:
 *     None
 *
 * Query Params:
 *     None
 *
 * Request Body:
 *     Content and Data for show
 *          {
 *              showDate,
 *              venue,
 *              venueUrl,
 *              ticketsUrl
 *          }
 *
 * Returns:
 *     JSON containing inserted row.
 *
 * Errors:
 *     400 - Validation Errors: missing showDate, venue, or tickets URL
 *     401 - Unauthorized
 *     403 - Forbidden
 *     
 * ------------------------------------------------------------
 */
router.post('/',  checkJwt, attachUserDetails, ensureAdmin, createShow);

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for deleting a show from the DB
 *
 * Route:
 *     DELETE /shows/:showId
 *
 * Route Params:
 *     showId: primary key id for show
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
 *     404 - NotFoundError
 *     401 - Unauthorized
 *     403 - Forbidden
 * ------------------------------------------------------------
 */
router.delete('/:postId', checkJwt, ensureAdmin, deleteShow)


module.exports = router;