const { Router } = require("express");
require("dotenv").config();
const multer = require('multer');
const {storage} = require('./multer/multer');
const jwt = require("jsonwebtoken")
const postControllers = require("./controllers/postControllers/postControllers");
const userControllers = require("./controllers/userControllers/userControllers");
const likeControllers = require('./controllers/likeControllers/likeControllers');
const pixController = require("./controllers/pixControllers/pixControllers");
const upload = multer({storage});
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET

function authMiddleware(req, res, next) {
  const token = req.cookies.session;
  if (!token) return res.sendStatus(401)
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
    next()
  } catch {
    if (res.status(401).json({ error })) return ;
  }
}

//Users routes
router.post('/api/google-login', userControllers.create_user);
router.get('/api/me', authMiddleware, userControllers.find_one_user);
router.post('/api/logout', (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // localhost
    path: '/'
  });

  return res.json({ ok: true });
});
router.get("/users",  userControllers.find_all_users);
router.post("/avatar", upload.single('avatar'), userControllers.create_avatar);
router.get("/user/avatar/:id_sub", userControllers.find_avatar);
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
router.post("/like", authMiddleware, likeControllers.giveALike);
router.get("/count/like/:id", likeControllers.countAllPostsLike);
router.post("/user/like", likeControllers.countLikeByUser);
//Pix Payment
router.post("/payment", pixController.createPix)
router.post("/webhook/mercadopago", pixController.statusWebhookMercadoPago);
router.post("/payment/approved", pixController.verifyStatusPaymentWasApproved);
router.put("/cancel-payment", pixController.cancelPayment);
module.exports = router;
