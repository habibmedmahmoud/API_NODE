const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // تحميل متغيرات البيئة

// إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary Upload Image
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto", // يدعم الصور والفيديوهات
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error( error);
    throw new Error("Internal Server Error (cloudinary)")
   
  }
};

// ✅ Cloudinary Remove Image
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return 
       result;
  } catch (error) {
    console.error( error);
    throw new Error("Internal Server Error (cloudinary)")
    };
  }


/**
 * ✅ Supprimer plusieurs images de Cloudinary
 * @param {Array<string>} publicIds - Liste des `public_id` des images à supprimer.
 * @returns {Object} Résultat de l'opération (succès ou échec).
 */
// ✅ Cloudinary Remove Image
const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const result = await cloudinary.v2.api.delete_resources(publicIds)
    return  result;
    } catch (error) {
    console.error( error);
    throw new Error("Internal Server Error (cloudinary)")
    };
  }


// ✅ تصدير الدوال
module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
};
