const { Router } = require("express");
require("dotenv").config;
const multer = require('multer');
const {storage} = require('./multer/multer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const postControllers = require("./controllers/postControllers/postControllers");
const userControllers = require("./controllers/userControllers/userControllers");
const likeControllers = require('./controllers/likeControllers/likeControllers');
const pixController = require("./controllers/pixControllers/pixControllers");
const upload = multer({storage});
const router = Router();

const users = [];

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

router.post('/api/google-login', userControllers.createUser);

//Users routes
router.get("/user/:id_sub", userControllers.findOneUser);
router.get("/users",  userControllers.findAllUsers);
router.post("/avatar", upload.single('avatar'), userControllers.createAvatar);
router.get("/user/avatar/:id_sub", userControllers.findAvatar);
router.get("/user/isadmin/:id_sub", userControllers.is_admin);
//Posts routes
router.post("/uploads", upload.single('file'), postControllers.createPost);
router.get("/posts", postControllers.findAllPosts);
router.get("/posts-admin", postControllers.findAllPostsToValidation);
router.get("/post/:id_sub", postControllers.findUserPosts);
router.get("/posts/premium", postControllers.findAllPremiumPosts);
router.put("/post-validation/:id", postControllers.updateToValidationPost);
router.put("/post-update/:id", postControllers.updatePost);
router.delete("/post-delete/:id", postControllers.deletePost);
//Likes routes
router.post("/like", likeControllers.giveALike);
router.get("/count/like/:id", likeControllers.countAllPostsLike);
router.post("/user/like", likeControllers.countLikeByUser);
//Pix Payment
router.post("/payment", pixController.createPix)
router.post("/webhook/mercadopago", pixController.statusWebhookMercadoPago);
router.post("/payment/approved", pixController.verifyStatusPaymentWasApproved);
router.put("/cancel-payment", pixController.cancelPayment);
module.exports = router;
