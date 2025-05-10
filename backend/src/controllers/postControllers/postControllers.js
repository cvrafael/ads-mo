const {db} = require("../../config/database");
const { QueryTypes } = require('sequelize');

module.exports = {
  async createPost(req, res) {
    try {
      await db.authenticate();
      // const { id } = req.params;
      const { title, description, image, fk_id_user_entity, premium, website, payment_status, id_payment } = req.body;

      const post = await db.query(
        `SELECT image
	        FROM public.posts where image = '${image}';`,
          { type: QueryTypes.SELECT });

          console.log('post', post);

      if (post != "") {
        res.status(400).json({ message: "Ops... already exists a image with name." });
      } else {
        const posts = await db.query(
        `INSERT INTO "public"."posts" ("title","description","image","fk_id_user_entity", "premium", "website", "payment_status", "id_payment") VALUES ('${title}','${description}','${image}','${fk_id_user_entity}', '${premium}', '${website}', '${payment_status}', '${id_payment}');`,
        { type: QueryTypes.INSERT });
        res.status(200).json(posts);
      }

    } catch (error) {
      res.status(400).json({ error });
      console.log('Erro ao tentar criar um novo POST', error)
    }
  },
  async findAllPosts(req, res) {
    try {
      await db.authenticate();

      const posts = await db.query(`
         SELECT 
          pp.id,
          pp.title, 
          pp.description, 
          pp.image,
          COUNT(CASE WHEN pl.like != '0' THEN '1' END) AS "like",
          pp.website,
          pp.premium
          FROM 
            public.posts pp
          LEFT JOIN 
            public.like pl ON pp.id = pl.fk_id_post
          WHERE pp.payment_status <> 'pending'
          GROUP BY 
            pp.id, pp.title, pp.description, pp.image
          ORDER BY 
            "like" desc;
        `, { type: QueryTypes.SELECT })

      res.status(200).json(posts);
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async findUserPosts(req, res) {
    try {
      await db.authenticate();
      const { id } = req.params;

      const userAllPosts = await db.query(
        `SELECT pp.id, pp.title, pp.description, pp.image, pp.fk_id_user_entity, pp."timestamp", pp.website, pp.payment_status FROM public.posts as pp
          JOIN public.user_entity as pue
          on pp.fk_id_user_entity = pue.id
          WHERE pue.id = '${id}';`,
          { type: QueryTypes.SELECT });

      res.status(200).json(userAllPosts);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  },
  async findAllPremiumPosts(req, res) {
    try {
      await db.authenticate();

      const allPremiumPosts = await db.query(
        ` SELECT 
          pp.id,
          pp.title, 
          pp.description, 
          pp.image,
          COUNT(CASE WHEN pl.like != '0' THEN '1' END) AS "like",
		      pp.premium as "premium",
          pp.website
          FROM 
            public.posts pp
          LEFT JOIN 
            public."like" pl ON pp.id = pl.fk_id_post
          WHERE pp."premium" = true and pp.payment_status <> 'pending'
          GROUP BY 
              pp.id, pp.title, pp.description, pp.image
          ORDER BY 
              "like" desc;`,
          { type: QueryTypes.SELECT });

      res.status(200).json(allPremiumPosts);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  },

  // async updateUser(req, res) {
  //   try {
  //     const { id } = req.body;
  //     const { post_name, post_description } = req.body;
  //     const post = await Post.findOne({ where: { id } });

  //     if (post) {
  //       await Post.create({ post_name, post_description }, { where: { id } });
  //     } else {
  //       res.status(401).json({ message: "Ops... usuario não existe" });

  //       res.status(200).json({ posts });
  //     }
  //   } catch (error) {
  //     res.status(400).json({ error });
  //   }
  // },
  // async deleteUser(req, res) {
  //   try {
  //     const { id } = req.params;

  //     const user = await User.findOne({ where: { id } });

  //     if (!user) {
  //       res.status(401).json({ message: "Ops... usuario não existe" });
  //     } else {
  //       await User.destroy({ where: { id } })
  //       res.status(200).json({ msg: "usuario deletado" });
  //     }


  //   } catch (error) {
  //     res.status(400).json({ error });
  //   }


  // }

}
