const { Router } = require("express");
const multer = require('multer');
const {storage} = require('./multer/multer');
const postControllers = require("./controllers/postControllers/postControllers");
const userControllers = require("./controllers/userControllers/userControllers");
const likeControllers = require('./controllers/likeControllers/likeControllers')

const upload = multer({storage});
const router = Router();

//Users routes
router.get("/user/:id", userControllers.findOneUser);
router.get("/users",  userControllers.findAllUsers);
router.post("/avatar", upload.single('avatar'), userControllers.createAvatar);
router.get("/user/avatar/:fk_id_user_entity", userControllers.findAvatar);
//Posts routes
router.post("/uploads", upload.single('file'), postControllers.createPost);
router.get("/posts", postControllers.findAllPosts);
router.get("/:id", postControllers.findUserPosts);
//Likes routes
router.post("/like", likeControllers.giveALike);
router.get("/count/like/:id", likeControllers.countAllPostsLike);
router.post("/user/like", likeControllers.countLikeByUser);

module.exports = router;
