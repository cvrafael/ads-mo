const {db} = require("../../config/database");
const { QueryTypes } = require('sequelize');
const { Payment, MercadoPagoConfig } = require('mercadopago');
const axios = require('axios');
const {uuidv4} = require('uuid');
require("dotenv").config;
const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN_MP,
    options: 
    { timeout: 5000 },
});
const payment = new Payment(client);

module.exports = {
    async createPix(req, res) {

        try {
            const {email, idUser, postName} = req.body;

            console.log('req.body',req.body);
            
            const pix = await payment.create({
                body: {
                    transaction_amount: 49.90,
                    description: `Pagamento para o produto: ${postName}`,
                    payment_method_id: process.env.PIX,
                    payer: {
                        email: email,
                      },
                      metadata: {
                        user_id: idUser,
                      }
                },
                requestOptions: {
                    idempotencyKey: uuidv4,
                  },
            })
            .then(console.log((result)=> console.log(result))).catch(console.error);
            
            res.status(200).json(pix);
        } catch (error) {
            res.status(400).json({ error });
            console.log('Erro ao tentar criar um novo POST', error)
        }
    },
    async statusWebhookMercadoPago(req, res) {
        try {
          const paymentId = req.body.resource;
            console.log('paymentId statusWebhookMercadoPago', paymentId);
            console.log('paymentId req.body?', req.body);
        
            if (!paymentId) return res.status(400).send('Payment ID not found');
        
            const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
              headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`
              }
            });
        
            const { status, id } = response.data;

            res.status(200).json(paymentId);
        
            // Atualizar o post com o status onde o payment_id corresponde
            await db.query(
              `UPDATE public.posts SET payment_status = '${status}' WHERE id_payment = '${id}'`,
              { type: QueryTypes.UPDATE }
            );
        
        } catch (error) {
          console.error('Erro ao processar webhook:', error);
          res.status(500).send('Erro interno');
        }
    },
    async verifyStatusPaymentWasApproved(req, res) {
       
            const {id_payment} = req.body;

            const [verifyPaymentStatys] = await db.query(`
                SELECT payment_status FROM public.posts 
                WHERE id_payment = '${id_payment}'
                ORDER BY created_at DESC 
                LIMIT 1;
              `, { type: QueryTypes.SELECT });
              console.log('verifyPaymentStatys',verifyPaymentStatys);
              if (verifyPaymentStatys && verifyPaymentStatys.payment_status == 'approved') {
                return res.status(200).json(verifyPaymentStatys.payment_status);
              }else if (verifyPaymentStatys && verifyPaymentStatys.payment_status == 'cancelled') {
                await db.query(`
                DELETE FROM public.posts 
                WHERE id_payment = '${id_payment}';
              `, { type: QueryTypes.DELETE });
                return res.status(200).json(verifyPaymentStatys.payment_status);
              }
    },
    async cancelPayment(req, res) {
      
      try {
        const { paymentId } = req.body;
      
        if (!paymentId) return res.status(200).json({ message: 'ID do pagamento não informado' });
        
        const response = await axios.put(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          { status: 'cancelled' },
          {
            headers: {
              Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`,
            },
          }
        );
    
        await db.query(
          `UPDATE public.posts SET payment_status = 'cancelled' WHERE id_payment = '${paymentId}'`,
          { type: QueryTypes.UPDATE }
        );
    
        res.status(200).json(`${response.data }`);
      } catch (error) {
        res.status(400).json({ message: 'Does not possible cancel payment.' });
      }
    }
}