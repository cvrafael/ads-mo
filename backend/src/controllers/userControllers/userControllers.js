const { db } = require("../../config/database");
const { QueryTypes } = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken')

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
 async create_user(req, res) {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });

    const { sub, email, email_verified, family_name, given_name, name, picture } =
      ticket.getPayload();

    const sessionToken = jwt.sign(
      { userId: sub },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🔥 COOKIE SEMPRE ANTES DO RETURN
    res.cookie('session', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    const user = await db.query(
      `SELECT * FROM public.user WHERE "id_sub" = '${sub}'`,
      { type: QueryTypes.SELECT }
    );

    if (!user[0]) {
      await db.query(
        `INSERT INTO public.user ("id_sub", "email", "email_verified", "family_name", "given_name", "name", "picture")
         VALUES ('${sub}', '${email}', '${email_verified}', '${family_name}', '${given_name}', '${name}', '${picture}')
         ON CONFLICT (id_sub) DO NOTHING`,
        { type: QueryTypes.INSERT }
      );

      const createdUser = await db.query(
        `SELECT * FROM public.user WHERE "id_sub" = '${sub}'`,
        { type: QueryTypes.SELECT }
      );

      return res.status(201).json(createdUser);
    }

    // 🔥 FALTAVA ISSO
    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro ao autenticar' });
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
  async find_all_users(req, res) {
    try {

      await db.authenticate();

      const users = await db.query(
        `SELECT *
          FROM public.user as pu ;`,
        { type: QueryTypes.SELECT });

      console.log(users);

    return  res.status(200).json(users);

    } catch (error) {

    return  res.status(400).json({ error });

    }
  },
  async find_one_user(req, res) {
    try {
      const userId = req.user.userId;

    const user = await db.query(
      `SELECT id_sub, email, name, picture FROM public.user WHERE id_sub = '${userId}'`,
    { type: QueryTypes.SELECT }
  );

  return res.status(200).json(user[0]);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  async create_avatar(req, res) {
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

  async find_avatar(req, res) {
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
