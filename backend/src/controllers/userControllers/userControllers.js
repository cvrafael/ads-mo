
const { User, Avatar } = require('../../../models/index.js');
const { Op } = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken')
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

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

    const user = await User.findAll({
      where: {
        id_sub: sub,
      },
    });
    
    // const user = await User.query(
      //   `SELECT * FROM public.user WHERE "id_sub" = '${sub}'`,
      //   { type: QueryTypes.SELECT }
      // );
      
      if (!user[0]) {
      await User.create({ id_sub: sub, email: email, email_verified: email_verified, family_name: family_name, given_name: given_name, name: name , picture: picture});
      // await User.query(
      //   `INSERT INTO public.user ("id_sub", "email", "email_verified", "family_name", "given_name", "name", "picture")
      //    VALUES ('${sub}', '${email}', '${email_verified}', '${family_name}', '${given_name}', '${name}', '${picture}')
      //    ON CONFLICT (id_sub) DO NOTHING`,
      //   { type: QueryTypes.INSERT }
      // );

      const createdUser = await User.findAll({
      where: {
        'id_sub': sub,
      },
    });

      // const createdUser = await User.query(
      //   `SELECT * FROM public.user WHERE id_sub = '${sub}'`,
      //   { type: QueryTypes.SELECT }
      // );

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

      const { id_sub } = req.params;

       const is_admin = await User.findAll({
        attributes: ['is_admin'],
        where: {
          'id_sub': id_sub,
        },
      });

      // const is_admin = await User.query(
      //   `SELECT is_admin
      //     FROM public.user as pu 
      //     WHERE id_sub = '${id_sub}';`,
      //   { type: QueryTypes.SELECT });

      res.status(200).json(is_admin);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },
  async find_all_users(req, res) {
    try {

    const users = await User.findAll({
      where: {
        id_sub: sub,
      },
    });

    return  res.status(200).json(users);

    } catch (error) {

    return  res.status(400).json({ error });

    }
  },
  async find_one_user(req, res) {
    try {
      const userId = req.user.userId;

      const user = await User.findAll({
        attributes: ['id_sub', 'email', 'name', 'family_name', 'picture'],
        where: {
          'id_sub': userId
        }
      });

  //   const user = await User.query(
  //     `SELECT id_sub, email, name, family_name, picture FROM public.user WHERE id_sub = '${userId}'`,
  //   { type: QueryTypes.SELECT }
  // );

  return res.status(200).json(user[0]);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },

  async create_avatar(req, res) {
    try {

      const { image, fk_id_user } = req.body;

      const createAvatar = await Avatar.create({ image: image, fk_id_user: fk_id_user});

      // await User.query(
      //   `INSERT INTO public.avatar ("image", "fk_id_user")
      //     VALUES ('${image}', '${fk_id_user}')
      //     ON CONFLICT (fk_id_user) DO UPDATE 
      //     SET image = EXCLUDED.image;`,
      //   { type: QueryTypes.INSERT });

      res.status(200).json(createAvatar);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },

  async find_avatar(req, res) {
    try {

      const { id_sub } = req.params;

    const avatar = await Avatar.findOne({
    attributes: ['image'],
    include:[ {
    model: User,
    where: {
      id_sub: {
        [Op.eq]: id_sub,
      },
    },
    attributes: [],
  },]
});

      // const avatar = await Avatar.query(
      //   `SELECT image
      //     FROM public.avatar as pa
      //   INNER JOIN public.user as pu
      //     ON pa.fk_id_user = pu.id_sub
      //     WHERE pa.fk_id_user = '${id_sub}';`,
      //   { type: QueryTypes.SELECT });

      res.status(200).json(avatar);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },

}
