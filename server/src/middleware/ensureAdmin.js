
const pool = require('../db/db')

const ensureAdmin = async (req, res, next) => {
    
    if (req.user.role != 'admin')
        return res.status(401);
    next();
};

module.exports = ensureAdmin;