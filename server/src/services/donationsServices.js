const pool = require('../db/db.js');
require('dotenv').config();
const {ValidationError, NotFoundError} = require('../errors/errors')



async function createDonation(data) {

    const {message, amount} = data;

    if (!amount) throw new ValidationError('Amount Required');


    const query = `
    INSERT INTO donations (donation_message, amount, donation_status)
    VALUES ($1, $2, 'pending')
    RETURNING *`;

    const result = await pool.query(query, [message, amount ]);

    return result.rows[0];

};


async function updateDonation(data){

    const {stripeId, dbId, status} = data;

    if (!dbId) throw new ValidationError('dbId required');

    if( !status )
    {
        const query = `
        UPDATE donations
        SET stripe_id = $1
        WHERE id = $2
        RETURNING *`;

        const result = await pool.query(query, [stripeId, dbId]);

        console.log('Donation stripeId updated');

        return result;
    }

    const query = `
        UPDATE donations
        SET donation_status = $1
        WHERE id = $2
        RETURNING *`;
    

    const result = await pool.query(query, [status, dbId]);

    console.log('Donation Status updated');

    return result.rows[0];
}



async function getDonation(donationId) {

    const query = `
    SELECT *
    FROM donations
    WHERE id = $1
    LIMIT 1`;

    const donation = await pool.query(query, [donationId]);

    if (!donation.rows[0]) throw new NotFoundError(`Donation with id: ${donationId} not found`)

    return donation.rows[0];

};

async function getDonations(data) {

    const query = `
    SELECT *
    FROM donations
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2`;

    const {limit, offset} = data; 

    if (limit > 100 || limit < 1) throw new ValidationError('Limit must be between 1 and 100')
    if (offset < 0) throw new ValidationError('Offset must be positive number')
    

    const donation = await pool.query(query, [limit, offset]);

    return donation.rows;

};


module.exports = { 
    getDonation, 
    getDonations,
    createDonation,
    updateDonation}


