const {AppError} = require('../errors/errors');


function errorHandler(err, req, res, next) {

    console.error(err);

    // Custome Error
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({error: err.message});
    }


        // Postgres errors
    if (err.code === '23505')
        return res.status(409).json({ error: 'Resource already exists' });
    if (err.code === '23503')
        return res.status(409).json({ error: 'Referenced resource does not exist' });
    if (err.code === '23502')
        return res.status(400).json({ error: 'Missing required field' });
    if (err.code === '22P02')
        return res.status(400).json({ error: 'Invalid input format' });

    // Unknown - don't leak internals
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler