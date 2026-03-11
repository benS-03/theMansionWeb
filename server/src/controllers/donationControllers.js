const ensureAdmin = require('../middleware/ensureAdmin')
const donationsServices = require('../services/donationsServices')
require('dotenv').config()
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(req, res,  next) {

    try {
        const {amount, message} = req.body;
        
    
        const donation = await donationsServices.createDonation({
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
    } catch (err) {
        next(err);
    }
    
}


async function handleWebhook(req, res,  next) {

    try{
        const sig = req.headers['stripe-signature'];

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
    next(err)
}}


async function getDonation(req, res,  next) {

    try {
        const donation = await donationsServices.getDonation(req.params.donationId);

        res.status(200).json({donation})
    }catch (err) {
        nexxt(err);
    }    
    
}


async function getDonations(req, res,  next) {

    const parsedLimit = Number(req.query.limit) || 10;
    const parsedOffset = Number(req.query.offset) || 0;

    try {
        const donations = await donationsServices.getDonations({limit: parsedLimit, offset: parsedOffset});

        res.status(200).json(donations);
    } catch (err) {
        next(err);
    }
}

module.exports = { createPaymentIntent, handleWebhook, getDonation, getDonations}