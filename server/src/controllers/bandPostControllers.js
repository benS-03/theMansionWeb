const bandPostsServices = require('../services/bandPostsServices')


async function getPosts(req, res) {
    
    try {
        const posts = await bandPostsServices.getPosts({
            limit: Number(req.query.limit),
            offset: Number(req.query.offset)
        })

        res.status(200).json(posts)
    }catch (err) {
        console.error(err)
        res.status(500).json({
            error: err.message
    });
    }
}

async function createPost(req, res) {

    if (req.role != 'admin')
        res.status(401);
    try {
        const {
            postType,
            title,
            body,
            imageUrl
        
        } = req.body;

        const result = await bandPostsServices.createPost({
            postType: postType,
            title: title,
            body: body,
            imageUrl: imageUrl
        });

        res.status(201).json(result);
    }catch (err) {
    res.status(500).json({
        error: err.message
    });
    }

}


async function deletePost(req,res) {
    if (req.role != 'admin')
        res.status(401);
    try {
        const result = await bandPostsServices.deletePost(req.params.postId);

        res.status(200).json(result);
    }catch (err) {
    res.status(500).json({
        error: err.message
    });
    }
    
}

module.exports = { 
    createPost,
    getPosts,
    deletePost
}
