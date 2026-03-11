const reviewsServices= require('../services/reviewsServices')
const ensureAdmin = require('../middleware/ensureAdmin')

async function getReviews(req, res,  next) {

    try {
        const posts = await reviewsServices.getReviews({
            limit: Number(req.query.limit) || 10,
            offset: Number(req.query.offset) || 0,
        })

        res.status(200).json(posts)
    } catch (err) {
        next(err);
    }
}

async function createReview(req, res,  next) {
    try {
        const {
            reviewer,
            score,
            body
        } = req.body;

        const result = await reviewsServices.createReview({reviewer, score, body});

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

async function deleteReview(req, res,  next) {
    if (req.role != 'admin')
        res.status(401);
    try {
        const result = await reviewsServices.deleteReview(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
        next(err);
    }
}

module.exports = {
    getReviews,
    createReview,
    deleteReview
}