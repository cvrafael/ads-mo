const { db } = require("../../config/database");
const { QueryTypes } = require('sequelize');

module.exports = {
  async giveALike(req, res) {
    try {
      await db.authenticate();
      const { like, fk_id_user_entity, fk_id_post } = req.body;

      const giveLike = await db.query(
        `INSERT INTO public.like ("like", "fk_id_user_entity", "fk_id_post")
              VALUES ('${like}', '${fk_id_user_entity}', '${fk_id_post}')
              ON CONFLICT (fk_id_user_entity, fk_id_post) DO UPDATE 
              SET "like" = EXCLUDED.like;`,
        { type: QueryTypes.INSERT }
      );
      res.status(200).json(giveLike);

    } catch (error) {
      res.status(400).json({ error });
      console.log('Erro ao dar like', error)
    }
  },
  async countPostsLike(req, res) {
    try {
      await db.authenticate();
      const { id } = req.params;

      const coutLikes = await db.query(
        `SELECT count(like) FROM public.like WHERE id = '${id}';`,
        { type: QueryTypes.SELECT })

      res.status(200).json(coutLikes);
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  async countAllPostsLike(req, res) {
    try {
      await db.authenticate();
      const { id } = req.params;

      const allLikes = await db.query(
        `SELECT COUNT(CASE WHEN pl.like != '0' THEN '1' END) AS like
          FROM public.like as pl
          where pl.fk_id_post = '${id}';`,
        { type: QueryTypes.SELECT })

      res.status(200).json(allLikes);
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  async countLikeByUser(req, res) {
    try {
      await db.authenticate();
      const { fk_id_post, fk_id_user_entity } = req.body;

      const countLike = await db.query(
        `SELECT "like"
          FROM public.like as pl
          where pl.fk_id_user_entity = '${fk_id_user_entity}' 
          and pl.fk_id_post = '${fk_id_post}';`,
        { type: QueryTypes.SELECT })

      res.status(200).json(countLike);
    } catch (error) {
      res.status(400).json({ error });
    }
  },

}
