
const pool = require('../db/db')

const ensureAdmin = async (req, res, next) => {
    
    if ( req.user.role === 'admin')
        next();
    
    return res.status(403).json({error: "admin access required"});
};

module.exports = ensureAdmin;