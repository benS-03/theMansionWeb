const reviewsServices= require('../services/reviewsServices')
const ensureAdmin = require('../middleware/ensureAdmin')

async function getReviews(req, res) {

    try {
        const posts = await reviewsServices.getReviews({
            limit: Number(req.query.limit),
            offset: Number(req.query.offset)
        })

        res.status(200).json(posts)
    } catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
}

async function createReview(req, res) {
    if (req.role != 'admin')
        res.status(401);
    try {
        const {
            reviewer,
            score,
            body
        } = req.body;

        const result = await reviewsServices.createReview([reviewer, score, body]);

        res.status(201).json(result);
    } catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
}

async function deleteReview(req, res) {
    if (req.role != 'admin')
        res.status(401);
    try {
        const result = await reviewsServices.deleteReview(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
}

module.exports = {
    getReviews,
    createReview,
    deleteReview
}