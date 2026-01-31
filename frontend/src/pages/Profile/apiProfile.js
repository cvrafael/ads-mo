import axios from "axios";

export async function postProfileDatas(avatar_datas) {

    await axios.post(`http://localhost:3030/avatar`, avatar_datas, {
        
        headers: {

            'Content-Type': 'multipart/form-data',

        },

    })
    .catch((error) => {

        console.log(error.message)

    })

};

export async function findAvatar(id){

    return await axios.get(`http://localhost:3030/user/avatar/${id}`)      

};