import axios from 'axios';

export async function deletePost(id) {
    return await axios.delete(`http://localhost:3030/post-delete/${id}`);
}