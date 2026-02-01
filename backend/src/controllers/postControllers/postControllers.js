
const { Posts, User, Like } = require("../../../models/index.js");
const { Op, Sequelize } = require('sequelize');
module.exports = {
  async createPost(req, res) {
    try {
      // const { id } = req.params;
      const { title, description, image, fk_id_user, premium, website, payment_status, id_payment, status } = req.body;

      // const img = await db.query(
      //   `SELECT image
      //     FROM public.posts where image = '${image}';`,
      //     { type: QueryTypes.SELECT });

      const img = await Posts.findAll({
        atributtes: ['image'],
        where: { image: image }
      })

      const tle = await Posts.findAll({
        atributtes: ['title'],
        where: {
          title: title,
        },
      });
      // `SELECT title
      //   FROM public.posts where title = '${title}';`,
      //   { type: QueryTypes.SELECT });

      if (img != "" || tle != "") {
        res.status(400).json("Ops... already exists a image or title with this name. Try again.");
      } else {
        const posts = await Posts.create({ title: title, description: description, image: image, fk_id_user: fk_id_user, premium: premium, website: website, payment_status: payment_status, id_payment: id_payment, status: status })
        // const posts = await db.query(
        // `INSERT INTO "public"."posts" ("title","description","image","fk_id_user", "premium", "website", "payment_status", "id_payment", "status") VALUES ('${title}','${description}','${image}','${fk_id_user}', '${premium}', '${website}', '${payment_status}', '${id_payment}', '${status}');`,
        // { type: QueryTypes.INSERT });
        res.status(200).json(posts);
      }

    } catch (error) {
      res.status(400).json({ message: `message: ${error}` });
    }
  },
  async updateToValidationPost(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await Posts.update(
        { status: status },
        {
          where: {
            id: id
          }
        }
      )
      // ` UPDATE public.posts set status = '${status}' WHERE id = '${id}';`,
      //   { type: QueryTypes.UPDATE });

      res.status(200).json({ msg: "Post Approved!" });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, description, website } = req.body;

      await Posts.update(
        {
          title: title, description: description, website: website
        },
        {
          where: {
            id: id
          }
        }
      )

      // await db.query(
      //   ` UPDATE public.posts set title = '${title}', description = '${description}', website = '${website}' WHERE id = '${id}';`,
      //     { type: QueryTypes.UPDATE });

      res.status(200).json({ msg: "Post Updated!" });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async findAllPosts(req, res) {
    try {

      const posts = await Posts.findAll({
        attributes: [
          'id',
          'title',
          'description',
          'image',
          'website',
          'premium',
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.literal(`CASE WHEN "likes"."like" <> '0' THEN 1 END`)
            ),
            'like',
          ],
        ],
        include: [
          {
            model: Like,
            attributes: [],
            required: false, // LEFT JOIN
          },
        ],
        where: {
          payment_status: {
            [Op.notIn]: ['pending', 'cancelled'],
          },
          status: 'approved',
        },
        group: [
          'posts.id',
          'posts.title',
          'posts.description',
          'posts.image',
          'posts.website',
          'posts.premium',
        ],
        order: [[Sequelize.literal('"like"'), 'DESC']],
      });

      // const posts = await db.query(`
      //    SELECT 
      //     pp.id,
      //     pp.title, 
      //     pp.description, 
      //     pp.image,
      //     COUNT(CASE WHEN pl.like != '0' THEN '1' END) AS "like",
      //     pp.website,
      //     pp.premium
      //     FROM 
      //       public.posts pp
      //     LEFT JOIN 
      //       public.like pl ON pp.id = pl.fk_id_post
      //     WHERE pp.payment_status <> 'pending' and pp.payment_status <> 'cancelled' and pp.status = 'approved'
      //     GROUP BY 
      //       pp.id, pp.title, pp.description, pp.image
      //     ORDER BY 
      //       "like" desc;
      //   `, { type: QueryTypes.SELECT })
      res.status(200).json(posts);
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async findAllPostsToValidation(req, res) {
    try {

      const postsToValidation = await Posts.findAll({
        attributes: [
          'id',
          'title',
          'description',
          'image',
          'website',
          'premium',
          'status',
        ],
        include: [
          {
            model: Like,
            attributes: [],
            required: false, // LEFT JOIN
          },
        ],
        where: {
          status: {
            [Op.ne]: 'approved',
          },
        },
        group: [
          'posts.id',
          'posts.title',
          'posts.description',
          'posts.image',
          'posts.website',
          'posts.premium',
          'posts.status',
        ],
        order: [['created_at', 'ASC']],
      });

      if (!postsToValidation) {
        res.status(400).json({ msg: 'Dont have posts in the moment' });
      }
      res.status(200).json(postsToValidation);

    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async findUserPosts(req, res) {
    try {

      const { id_sub } = req.params;

      const userAllPosts = await Posts.findAll({
        attributes: [
          'id',
          'title',
          'description',
          'image',
          'fk_id_user',
          'created_at',
          'website',
          'payment_status',
          'status',
        ],
        include: [
          {
            model: User,
            attributes: [], // não retorna dados do user
            required: true, // JOIN (INNER JOIN)
            where: {
              id_sub: id_sub,
            },
          },
        ],
      });


      res.status(200).json(userAllPosts);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  },
  async findAllPremiumPosts(req, res) {
    try {

      const allPremiumPosts = await Posts.findAll({
        attributes: [
          'id',
          'title',
          'description',
          'image',
          'website',
          ['premium', 'premium'],
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.literal(`CASE WHEN "likes"."like" <> '0' THEN 1 END`)
            ),
            'like',
          ],
        ],
        include: [
          {
            model: Like,
            attributes: [],
            required: false, // LEFT JOIN
          },
        ],
        where: {
          premium: true,
          payment_status: {
            [Op.ne]: 'pending',
          },
          status: 'approved',
        },
        group: [
          'posts.id',
          'posts.title',
          'posts.description',
          'posts.image',
          'posts.website',
          'posts.premium',
        ],
        order: [[Sequelize.literal('"like"'), 'DESC']],
      });


      res.status(200).json(allPremiumPosts);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  },
  async deletePost(req, res) {
    const { id } = req.params;
    try {

      await Posts.destroy({
        where: {
          id: id,
        },
      });


      res.status(200).json({ message: 'Post deleted with success' });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
}
