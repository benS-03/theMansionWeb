const pool = require('../db/db.js');
require('dotenv').config();



async function createDonation(data) {

    const {message, amount} = data;

    const query = `
    INSERT INTO donations (donation_message, amount, donation_status)
    VALUES ($1, $2, 'pending')
    RETURNING *`;

    const result = await pool.query(query, [message, amount ]);

    return result.rows[0];

};


async function updateDonation(data){

    const {stripeId, dbId, status} = data;

    if( !status )
    {
        const query = `
        UPDATE donations
        SET stripe_id = $1
        WHERE id = $2
        RETURNING *`;

        const result = await pool.query(query, [stripeId, dbId]);

        return result;
    }

    const query = `
        UPDATE donations
        SET status = $1
        WHERE id = $2
        RETURNING *`;
    

    const result = pool.query(query, [status, dbId]);

    return result.rows[0];
}



async function getDonation(donationId) {

    const query = `
    SELECT *
    FROM donations
    WHERE id = $1
    LIMIT 1`;

    const donation = await pool.query(query, [donationId]);

    return donation.rows[0];

};

async function getDonations(data) {

    const query = `
    SELECT *
    FROM donations
    ORDER BY created_at DESC
    LIMIT $1 OFFSET = $2`;

    const {limit, offset} = data; 


    const donation = await pool.query(query, [limit, offest]);

    return donation.rows;

};


module.exports = { 
    getDonation, 
    getDonations,
    createDonation,
    updateDonation}


