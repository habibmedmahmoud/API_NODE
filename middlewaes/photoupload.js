const multer = require('multer');
const path = require('path');

// إعداد تخزين الصور
const photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../image")); // ✅ تصحيح __dirname
    },
    filename: function (req, file, cb) {
        if (file) {
            // استبدال ":" في التاريخ لتجنب مشاكل أسماء الملفات
            cb(null, new Date().toISOString().replace(/:/g, "-") + '-' + file.originalname);
        } else {
            cb(null, false);
        }
    }
});

const PhotoUpload = multer({
    storage : photoStorage,
    fileFilter : function(req , file , cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true);
        }
        else {
            cb({ message: " Unsupported file format"});
        }
    },
    limits: { fileSize: 1024 * 1024 }  // 1 megabyte 
});
 module.exports =  PhotoUpload ;



