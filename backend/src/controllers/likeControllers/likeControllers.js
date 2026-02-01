const { Op, Sequelize } = require('sequelize');
const { Like, User, Avatar } = require('../../../models/index.js');

module.exports = {
  async giveALike(req, res) {
    try {
      const { like, fk_id_user, fk_id_post } = req.body;

      const giveLike = await Like.upsert({
        like,
        fk_id_user,
        fk_id_post,
      });

      res.status(200).json(giveLike);

    } catch (error) {
      res.status(400).json({ error });
      console.log('Erro ao dar like', error)
    }
  },
  async countPostsLike(req, res) {
    try {
      const { id } = req.params;

      const countLikes = await Like.count({
        where: {
          id: {
            [Op.gt]: id
          }
        }
      })

      res.status(200).json(countLikes);
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  async countAllPostsLike(req, res) {
    try {

      const { id } = req.params;

      const allLikes = await Like.findOne({
        attributes: [
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.literal(`CASE WHEN "like" <> '0' THEN 1 END`)
            ),
            'like',
          ],
        ],
        where: {
          fk_id_post: id,
        },
        raw: true,
      });

      res.status(200).json(allLikes);
    } catch (error) {
      res.status(400).json({ error });
      console.log('Erro ao dar like', error)
    }
  },

  async countLikeByUser(req, res) {
    try {
      const { fk_id_post, fk_id_user } = req.body;

      const record = await Like.findOne({
        attributes: ['like'],
        where: {
          fk_id_user,
          fk_id_post,
        },
        raw: true,
      });

      const countLike = record?.like ?? '0';

      res.status(200).json(countLike);
    } catch (error) {
      res.status(400).json({ error });
    }
  },

}
