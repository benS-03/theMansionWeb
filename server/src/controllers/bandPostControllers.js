const bandPostsServices = require('../services/bandPostsServices')


async function getPosts(req, res,  next) {
    
    try {

        const limit = Number(req.query.limit) || 10;    // default 10
        const offset = Number(req.query.offset) || 0;

        const posts = await bandPostsServices.getPosts({
            limit,
            offset
        })


        return res.status(200).json(posts)
    }catch (err) {
        next(err);
    };
}

async function createPost(req, res,  next) {

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
        next(err);
    }

}


async function deletePost(req,res,  next) {

    try {
        const result = await bandPostsServices.deletePost(req.params.postId);

        return res.status(200).json(result);
    }catch (err) {
        next(err);
    }
    
}

module.exports = { 
    createPost,
    getPosts,
    deletePost
}
