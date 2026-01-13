import axios from "axios";

export async function getDatasUser(datas) {
    const {sub, email, email_verified, family_name, given_name, name} = datas;
    return await axios.post('http://localhost:3030/user', {
        "id_sub": sub, 
        "email": email, 
        "email_verified": email_verified, 
        "family_name": family_name, 
        "given_name": given_name, 
        "name": name
    });
}
// export async function validationTheNewPost(id, status) {
//     return await axios.put(`http://localhost:3030/post-validation/${id}`, {status: status} );
// }

// export async function updatePost(id, title, description, website) {
//     return await axios.put(`http://localhost:3030/post-update/${id}`, {
//         title:title, 
//         description:description, 
//         website:website
//     });
// }