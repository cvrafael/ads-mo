import axios from 'axios';

export async function getAllRunins() {
    return await axios.get(`${import.meta.env.VITE_API_BACKEND}tracker-maintenance`)
}

export async function countLikes(id) {
    return await axios.get(`${import.meta.env.VITE_API_BACKEND}count/like/${id}`)
}

export async function likeUpdate(id, idUser) {
    return await axios.post(`${import.meta.env.VITE_API_BACKEND}user/like`, {
        "fk_id_post": id,
        "fk_id_user_entity": idUser
    })
}