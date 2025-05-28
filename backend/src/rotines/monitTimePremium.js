//File being executed in crontab
require('dotenv').config({ path: __dirname + '/../../.env' });
const {db} = require("../config/database");
const { QueryTypes } = require('sequelize');
async function updateExpirePostPremium() {
     try {

      await db.authenticate();

      const result = await db.query(`
      UPDATE public.posts
      SET status = 'expired'
      WHERE payment_last_update IS NOT NULL
        AND status <> 'expired'
        AND NOW() >= payment_last_update + interval '30 days';
    `, { type: QueryTypes.UPDATE });
          
      console.log("Consulta realizada com sucesso.", result);
      process.exit(0);
    } catch (error) {
      console.error("Erro ao expirar post:", error);
      process.exit(1);
    }
}

updateExpirePostPremium();