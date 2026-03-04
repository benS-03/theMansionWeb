const musicPostsServices = require('../services/musicPostsServices')
const ensureAdmin = require('../middleware/ensureAdmin')


async function getMusicPosts(req, res) {
    
   try {
        const posts = await musicPostsServices.getMPosts({
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

async function createMusicPost(req, res) {
   if (req.role != 'admin')
        res.status(401);
    try {
        const {
            title,
            imageUrl,
            links
        } = req.body;

        const result = await musicPostsServices.createMPost({title,  imageUrl, links});

        res.status(201).json(result);
    } catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
}


async function deleteMusicPost(req, res) {
    if (req.role != 'admin')
        res.status(401);
    try {
        const result = await musicPostsServices.deleteMPost(req.params.postId);

        res.status(201).json(result);
    }catch (err) {
    console.error(err)
    res.status(500).json({
        error: err.message
    });
    }
}

module.exports = {
    getMusicPosts,
    createMusicPost, 
    deleteMusicPost
}