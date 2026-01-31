import axios from "axios";

// export async function getDatasUser(datas) {
//     const {sub, email, email_verified, family_name, given_name, name} = datas;
//     return await axios.post('http://localhost:3030/user', {
//         "id_sub": sub, 
//         "email": email, 
//         "email_verified": email_verified, 
//         "family_name": family_name, 
//         "given_name": given_name, 
//         "name": name
//     });
// }
export async function getApiUserDatas(googleLogin) {

    return await axios.post(`http://localhost:3030/api/google-login`,

        {
            token: googleLogin.credential
        },
        {
            withCredentials: true
        }

    );

}

export async function isAdmin(id_sub) {

    return await axios.get(`http://localhost:3030/user/isadmin/${id_sub}`);

}

export async function recoveryUser() {

        return await axios.get(`http://localhost:3030/api/me`,
    
            {
                withCredentials: true, // 🔥 MUITO IMPORTANTE
                headers: { 'Content-Type': 'application/json' },
            }
    
        );

}

export async function logout() {

    return await axios.post('http://localhost:3030/api/logout', {},

        {
            withCredentials: true,
        }
    );

}