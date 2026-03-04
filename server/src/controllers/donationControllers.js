const ensureAdmin = require('../middleware/ensureAdmin')
const donationsServices = require('../services/donationsServices')
require('dotenv').config()
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(req, res) {

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
            clientSecret: paymentIntent.client_secret
        });
    
}


async function handleWebhook(req, res) {

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
}}


async function getDonation(req, res) {

    try {
        const donation = await getDonation(req.params.donationId);

        res.status(200).jso
    }catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }    
    
}


async function getDonations(req, res) {

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
}

module.exports = { createPaymentIntent, handleWebhook, getDonation, getDonations}