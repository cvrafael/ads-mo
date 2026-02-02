import axios from "axios";

export async function getAllPosts() {
    return await axios.get(`${import.meta.env.VITE_API_BACKEND}posts-admin`);
}
export async function validationTheNewPost(id, status) {
    return await axios.put(`${import.meta.env.VITE_API_BACKEND}post-validation/${id}`, {status: status} );
}

export async function updatePost(id, title, description, website) {
    return await axios.put(`${import.meta.env.VITE_API_BACKEND}post-update/${id}`, {
        title:title, 
        description:description, 
        website:website
    });
}