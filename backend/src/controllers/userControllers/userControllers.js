const { db } = require("../../config/database");
const { QueryTypes } = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

module.exports = {
  async createUser(req, res) {
    const users = [];
    try {
      function upsert(array, item) {
        const i = array.findIndex((_item) => _item.email === item.email);
        if (i > -1) array[i] = item;
        else array.push(item);
      }

      await db.authenticate();
      const { token } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });

      const { sub, email, email_verified, family_name, given_name, name } = ticket.getPayload();
      upsert(users, { sub, email, email_verified, family_name, given_name, name });
      const create_user = await db.query(
        `INSERT INTO public.user ("id_sub", "email", "email_verified", "family_name", "given_name", "name")
          VALUES ('${sub}', '${email}', '${email_verified}', '${family_name}', '${given_name}', '${name}')
          ON CONFLICT (id_sub) DO NOTHING;`,
        { type: QueryTypes.INSERT });

      console.log(create_user);

      res.status(200).json(create_user);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },
  async is_admin(req, res) {
    try {

      await db.authenticate();

      const { id_sub } = req.params;

      const is_admin = await db.query(
        `SELECT is_admin
          FROM public.user as pu 
          WHERE id_sub = '${id_sub}';`,
        { type: QueryTypes.SELECT });

      console.log(is_admin);

      res.status(200).json(is_admin);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },
  async findAllUsers(req, res) {
    try {

      await db.authenticate();

      const users = await db.query(
        `SELECT *
          FROM public.user as pu ;`,
        { type: QueryTypes.SELECT });

      console.log(users);

      res.status(200).json(users);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },
  async findOneUser(req, res) {
    try {
      await db.authenticate();
      const { id_sub } = req.params;

      const allUsers = await db.query(
        `SELECT "id_sub", "email", "email_verified", "family_name", "given_name", "name"
	        FROM public.user where id_sub = '${id_sub}';`,
        { type: QueryTypes.SELECT });
      console.log(allUsers);
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  },

  async createAvatar(req, res) {
    try {

      await db.authenticate();

      const { image, fk_id_user } = req.body;

      const createAvatar = await db.query(
        `INSERT INTO public.avatar ("image", "fk_id_user")
          VALUES ('${image}', '${fk_id_user}')
          ON CONFLICT (fk_id_user) DO UPDATE 
          SET image = EXCLUDED.image;`,
        { type: QueryTypes.INSERT });

      console.log(createAvatar);

      res.status(200).json(createAvatar);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },

  async findAvatar(req, res) {
    try {

      await db.authenticate();

      const { id_sub } = req.params;

      const avatar = await db.query(
        `SELECT image
          FROM public.avatar as pa
        INNER JOIN public.user as pu
          ON pa.fk_id_user = pu.id_sub
          WHERE pa.fk_id_user = '${id_sub}';`,
        { type: QueryTypes.SELECT });

      console.log(avatar);

      res.status(200).json(avatar);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },

}
