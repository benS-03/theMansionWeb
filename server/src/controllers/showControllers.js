const showsServices = require('../services/showsServices')
const ensureAdmin = require('../middleware/ensureAdmin')


async function getShows(req, res,  next) {
  
    try {
        const posts = await showsServices.getShows({
                    limit: Number(req.query.limit) || 10,
                    offset: Number(req.query.offset) || 0
                })

        res.status(200).json(posts)
    } catch (err) {
        next(err);
    }
}

async function createShow(req, res,  next) {
    try {
        const {
            showDate,
            venue,
            venueUrl,
            ticketsUrl
        } = req.body;

        const result = await showsServices.createShow({showDate, venue, venueUrl, ticketsUrl});

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

async function deleteShow(req, res,  next) {
    if (req.role != 'admin')
        res.status(401);
    try {
        const result = await showsServices.deleteShow(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
        next(err);
    }
}

module.exports = {
    getShows,
    createShow,
    deleteShow
}