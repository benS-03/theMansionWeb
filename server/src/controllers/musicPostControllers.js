const musicPostsServices = require('../services/musicPostsServices')
const ensureAdmin = require('../middleware/ensureAdmin')


async function getMusicPosts(req, res,  next) {
    
   try {
        const posts = await musicPostsServices.getMPosts({
            limit: Number(req.query.limit) || 10,
            offset: Number(req.query.offset) || 0
        })

        res.status(200).json(posts)
    } catch (err) {
        next(err);
    }
}

async function createMusicPost(req, res,  next) {
    try {
        const {
            title,
            imageUrl,
            links
        } = req.body;

        const result = await musicPostsServices.createMPost({title,  imageUrl, links});

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}


async function deleteMusicPost(req, res,  next) {
    try {
        const result = await musicPostsServices.deleteMPost(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
        next(err);
    }
}

module.exports = {
    getMusicPosts,
    createMusicPost, 
    deleteMusicPost
}