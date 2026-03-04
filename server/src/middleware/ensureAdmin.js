
const pool = require('../db/db')

const ensureAdmin = async (req, res, next) => {
    const auth0Id = req.auth.sub;

    const query = `
    SELECT user_role
    FROM users
    WHERE auth0_id = $1`;

    const result = await pool.query(query, [auth0Id])

    req.role = result.rows[0].user_role;

    next();
};

module.exports = ensureAdmin;