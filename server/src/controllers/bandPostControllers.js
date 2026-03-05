const bandPostsServices = require('../services/bandPostsServices')


async function getPosts(req, res) {
    
    try {

        const limit = Number(req.query.limit) || 10;    // default 10
        const offset = Number(req.query.offset) || 0;

        const posts = await bandPostsServices.getPosts({
            limit,
            offset
        })


        return res.status(200).json(posts)
    }catch (err) {
        console.error(err)
        return res.status(500).json({
            error: err.message
    });
    }
}

async function createPost(req, res) {

    if (req.user.role != 'admin')
        return res.status(401);
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

        console.log("Band Post Created", result)

        return res.status(201).json(result);
    }catch (err) {
    res.status(500).json({
        error: err.message
    });
    }

}


async function deletePost(req,res) {
    if (req.user.role != 'admin')
        return res.status(401);
    try {
        const result = await bandPostsServices.deletePost(req.params.postId);

        return res.status(200).json(result);
    }catch (err) {
    return res.status(500).json({
        error: err.message
    });
    }
    
}

module.exports = { 
    createPost,
    getPosts,
    deletePost
}
