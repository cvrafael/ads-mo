import axios from "axios"
export async function postApiMercadoPago(email, idUser, postName) {
    return await axios.post(`${import.meta.env.VITE_API_BACKEND}payment`, {email: email, user_id: idUser, postName});
}

export async function postApiUploadAds(newArrayObject) {
    return await axios.post(`${import.meta.env.VITE_API_BACKEND}uploads`, newArrayObject, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }})
}

export async function getPaymentStatus(paymentId) {
    return await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`,{
        headers: {
          'Authorization': 'Bearer APP_USR-6743924456960489-050612-abc6032902b4eef1f1bc6feff4342b6c-421752700',
        }});
}

export async function verifyPaymentWasApproved(paymentId) {
  return await axios.post(`${import.meta.env.VITE_API_BACKEND}payment/approved`, {id_payment: paymentId});
}

export async function handleCancelPayment(paymentId) {
    return await axios.put(`${import.meta.env.VITE_API_BACKEND}cancel-payment`, {paymentId} )   
}