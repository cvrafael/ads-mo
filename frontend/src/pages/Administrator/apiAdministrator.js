import axios from "axios";

export async function getAllPosts() {
    return  await axios.get('http://localhost:3030/posts-admin');
}
export async function validationTheNewPost(id, status) {
    return await axios.put(`http://localhost:3030/post-validation/${id}`, {status: status} );
}

export async function updatePost(id, title, description, website) {
    return await axios.put(`http://localhost:3030/post-update/${id}`, {
        title:title, 
        description:description, 
        website:website
    });
}