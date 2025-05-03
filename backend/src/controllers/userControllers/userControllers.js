const {db} = require("../../config/database");
const { QueryTypes } = require('sequelize');

module.exports = {
  async findAllUsers(req, res) {
    try {

      await db.authenticate();

      const users = await db.query(
        `SELECT *
          FROM public.user_entity as pa ;`,
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
      const {id} = req.params;

      const allUsers = await db.query(
        `SELECT id, email, enabled, first_name, last_name, username
	        FROM public.user_entity where id = '${id}';`,
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

      const {image, fk_id_user_entity} = req.body;

      const createAvatar = await db.query(
        `INSERT INTO public.avatar ("image", "fk_id_user_entity")
          VALUES ('${image}', '${fk_id_user_entity}')
          ON CONFLICT (fk_id_user_entity) DO UPDATE 
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

      const {fk_id_user_entity} = req.params;

      const avatar = await db.query(
        `SELECT image
          FROM public.avatar as pa
        INNER JOIN public.user_entity as pe 
          ON pa.fk_id_user_entity = pe.id
          WHERE pa.fk_id_user_entity = '${fk_id_user_entity}';`,
          { type: QueryTypes.SELECT });

        console.log(avatar);

      res.status(200).json(avatar);

    } catch (error) {

      res.status(400).json({ error });
      console.log(error);

    }
  },

}
