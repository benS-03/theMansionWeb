const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin')
const donationsServices = require('../services/donationsServices')
require('dotenv').config()
const { createPaymentIntent, handleWebhook, getDonation, getDonations} = require('../controllers/donationControllers')




router.post('/create_payment_intent',  express.json(), createPaymentIntent)



router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook)

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for getting single donation record from DB
 *
 * Route:
 *     GET /donations/:donationId
 *
 * Route Params:
 *     donationId: primary key id for donation
 *
 * Query Params:
 *     None
 *
 * Request Body:
 *     None
 *
 * Returns:
 *     JSON containing donation record.
 *
 * Errors:
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.get('/:donationId', express.json(),  getDonation);

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used for getting paginated list of donations
 *     orderd by time created descending.
 *
 * Route:
 *     GET /donations
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
 *     JSON of donations
 *
 * Errors:
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.get('/', express.json(),  getDonations)


module.exports = router;

