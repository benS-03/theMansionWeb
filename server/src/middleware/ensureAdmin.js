
const { ForbiddenError, UnauthorizedError } = require('../errors/errors');

const ensureAdmin = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError('You must be logged in');

        if (req.user.role !== 'admin')
            throw new ForbiddenError('Admin access required');

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = ensureAdmin;