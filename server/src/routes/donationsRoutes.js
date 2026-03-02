const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin')
const donationsServices = require('../services/donationsServices')
require('dotenv').config()




router.post('/create_payment_intent', async (req, res) => {
    
    const {amount, message} = req.body;


    const donation = donationsServices.createDonation({
        message,
        amount
    });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true
        },
        metadata: {
            donationId: donation.id
        }

    });

    await donationsServices.updateDonation({
        stripeId: paymentIntent.id,
        dbId: donation.id
    })

    res.json({
        clientSecret: paymentIntent.clien_secret
    });
})



router.post('/webhook', async (req, res) => {
    try{
        const sig = req.headers['stripe-signaure'];

        let event; 

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;

            const donationId = paymentIntent.metadata.donationId
            await donationsServices.updateDonation({status: 'completed', dbId: donationId})

            res.json({received: true});
        }
    }catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
}})

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
router.get('/:donationId', async (req, res) => {

    try {
        const donation = await getDonation(req.params.donationId);

        res.status(200).jso
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
router.get('/', async (req, res) => {

    const parsedLimit = Number(req.query.limit) || 10;
    const parsedOffset = Number(req.query.offset) || 0;

    try {
        const donations = await getDonations({limit: parsedLimit, offset: parsedOffset});

        res.status(200).json(donations);
    } catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
})

