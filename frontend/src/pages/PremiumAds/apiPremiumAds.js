import axios from 'axios';

export async function getAllPremiumPosts() {
    return await axios.get('http://localhost:3030/posts/premium')
}

export async function countLikes(id) {
    return await axios.get(`http://localhost:3030/count/like/${id}`)
}

export async function likeUpdate(id, idUser) {
    return await axios.post('http://localhost:3030/user/like', {
        "fk_id_post": id,
        "fk_id_user_entity": idUser
    })
}