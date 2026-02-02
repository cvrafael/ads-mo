import axios from "axios";

export async function postProfileDatas(avatar_datas) {

    await axios.post(`${import.meta.env.VITE_API_BACKEND}avatar`, avatar_datas, {
        
        headers: {

            'Content-Type': 'multipart/form-data',

        },

    })
    .catch((error) => {

        console.log(error.message)

    })

};

export async function findAvatar(id){

    return await axios.get(`${import.meta.env.VITE_API_BACKEND}user/avatar/${id}`)      

};