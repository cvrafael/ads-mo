const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination: function(req, file, cb) {
           return cb(null, path.resolve("src/public/uploads"))
       },
       filename: function (req, file, cb) {
           return cb(null, `${file.originalname}`)
       }
});

const avatar = multer.diskStorage({
    destination: function(req, avatar, cb) {
            return cb(null, path.resolve("src/public/avatar"));
        },
        filename: function (req, avatar, cb) {
            return cb(null, `${avatar.originalname}`)
        }
 });
module.exports = {storage, avatar};