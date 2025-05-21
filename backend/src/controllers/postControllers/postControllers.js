const {db} = require("../../config/database");
const { QueryTypes } = require('sequelize');

module.exports = {
  async createPost(req, res) {
    try {
      await db.authenticate();
      // const { id } = req.params;
      const { title, description, image, fk_id_user_entity, premium, website, payment_status, id_payment, status } = req.body;

      const img = await db.query(
        `SELECT image
	        FROM public.posts where image = '${image}';`,
          { type: QueryTypes.SELECT });

      const tle = await db.query(
        `SELECT title
	        FROM public.posts where title = '${title}';`,
          { type: QueryTypes.SELECT });

      if (img != "" || tle != "") {
        res.status(400).json("Ops... already exists a image or title with this name. Try again.");
      } else {
        const posts = await db.query(
        `INSERT INTO "public"."posts" ("title","description","image","fk_id_user_entity", "premium", "website", "payment_status", "id_payment", "status") VALUES ('${title}','${description}','${image}','${fk_id_user_entity}', '${premium}', '${website}', '${payment_status}', '${id_payment}', '${status}');`,
        { type: QueryTypes.INSERT });
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

      await db.authenticate();

      await db.query(
        ` UPDATE public.posts set status = '${status}' WHERE id = '${id}';`,
          { type: QueryTypes.UPDATE });
          
      res.status(200).json({ msg: "Post Approved!" });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
   async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, description, website } = req.body;

      await db.authenticate();

      await db.query(
        ` UPDATE public.posts set title = '${title}', description = '${description}', website = '${website}' WHERE id = '${id}';`,
          { type: QueryTypes.UPDATE });
          
      res.status(200).json({ msg: "Post Updated!" });
    } catch (error) {
      res.status(400).json({ error });
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
          WHERE pp.payment_status <> 'pending' and pp.payment_status <> 'cancelled' and pp.status = 'approved'
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
  async findAllPostsToValidation(req, res) {
    try {
      await db.authenticate();

      const postsToValidation = await db.query(`
         SELECT 
          pp.id,
          pp.title, 
          pp.description, 
          pp.image,
          pp.website,
          pp.premium,
          pp.status
          FROM 
            public.posts pp
          LEFT JOIN 
            public.like pl ON pp.id = pl.fk_id_post
          WHERE pp.status <> 'approved'
          GROUP BY 
            pp.id, pp.title, pp.description, pp.image
          ORDER BY 
            pp.timestamp ASC;
        `, { type: QueryTypes.SELECT });
        
        if (!postsToValidation) {
          res.status(400).json({msg: 'Dont have posts in the moment'});
        }
        res.status(200).json(postsToValidation);

    } catch (error) {
      res.status(400).json({error});
    }
  },
  async findUserPosts(req, res) {
    try {
      await db.authenticate();
      const { id } = req.params;

      const userAllPosts = await db.query(
        `SELECT pp.id, pp.title, pp.description, pp.image, pp.fk_id_user_entity, pp."timestamp", pp.website, pp.payment_status, pp.status FROM public.posts as pp
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
          WHERE pp."premium" = true and pp.payment_status <> 'pending' and pp.status = 'approved'
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
