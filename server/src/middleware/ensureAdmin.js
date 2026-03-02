
const pool = require('../db/db')

const ensureAdmin = async (req, res, next) => {
    try{
        const auth0Id = req.auth.payload.sub;

        const query = `
        DB STRuCTURE NOT INit yET`;

        const result = await pool.query(query, [])

        if (result.rows[0].isadmin === 0)
        {
            throw new Error('Unauthorized: Not an Admin');
        }

        next();
    } catch {err}
    {
        next(err);
    }
};

module.exports = ensureAdmin;