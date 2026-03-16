import client from "./client"


export async function getPosts({limit, offset} = {}) {
    const { data } = await client.get('/bandPosts', {
        params: {limit, offset}
    })

    return data
}


export async function createPost(post) {
    const {data} = await client.post('/bandPosts', post)
    return data
}

export async function deletePost(postId) {
    const {data} = await client.delete(`/bandPosts/${postId}`)
    return data
 }