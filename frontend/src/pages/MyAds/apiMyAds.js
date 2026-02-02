import axios from 'axios';

export async function deletePost(id) {
    return await axios.delete(`${import.meta.env.VITE_API_BACKEND}post-delete/${id}`);
}