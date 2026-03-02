const express = require('express');
const router = express.Router();
const {getShows, createShow, deleteShow} = require('../services/showsServices')
const ensureAdmin = require('../middleware/ensureAdmin')

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
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.get('/', async (req, res) => {
    
    try {
        const posts = await getShows({
            limit: req.query.limit,
            offset: req.query.offset
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
 *     Content and Data for show, ******NOT DEFINED YET******
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
            showDate,
            venue,
            venueUrl,
            ticketsUrl
        } = req.body;

        const result = await createShow({showDate, venue, venueUrl, ticketsUrl});

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
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.delete('/:postId', ensureAdmin, async (req, res) => {

    try {
        const result = await deleteShow(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
})