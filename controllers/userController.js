const { User, validateUpdateUser } = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const  {
   cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
}= require('../utils/cloudinary');
const streamifier = require('streamifier');
const path = require('path'); // <== هذا هو المطلوب
const fs = require('fs');     // <== إذا كنت تستخدم fs.unlinkSync



/**
 * @desc Get ALL users profile  
 * @route  /api/users/profile
 * @methode GET 
 * @access private (only  admin) 
 */

module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
   return res.status(200).json(users);
});


/**
 * @desc Get ALL users profile  
 * @route  /api/users/profile/:id
 * @methode GET 
 * @access public 
 */


module.exports.getUserById =  asyncHandler(async(req,res)=> {
    
     const user = await User.findById(req.params.id).select("-password");
     if(!user) {
          return res.status(404).json({message :" user not found "}); 
     }
     return res.status(200).json(user);
});

// UPDATE user profile (only user or admin)
module.exports.updateProfile = asyncHandler(async (req, res) => {
  // تحقق صلاحيات
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  // تحقق صحة البيانات
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // تجهيز بيانات التحديث
  const updateData = {
    
    name :req.body.name ,
    phone : req.body.phone ,
    country : req.body.country 
  };

  // إذا كانت كلمة السر موجودة حدثها بعد تشفيرها
  // if (req.body.password) {
  //   const salt = await bcrypt.genSalt(10);
  //   updateData.password = await bcrypt.hash(req.body.password, salt);
  // }

  // تحديث المستخدم في DB مع إرجاع النسخة الجديدة بدون كلمة المرور
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

// @desc Upload image to Cloudinary
// UPLOAD profile photo
module.exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "❌ No file provided" });
  }

  // مسار الملف المؤقت المرفوع
  const imagePath = path.join(__dirname, `../image/${req.file.filename}`);

  // رفع الصورة إلى Cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  if (!result.success) {
    return res.status(500).json({ message: `❌ Upload failed: ${result.message}` });
  }

  // جلب المستخدم
  const user = await User.findById(req.user.id);

  // حذف الصورة القديمة من Cloudinary إن وجدت
  if (user.profilePhoto?.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // تحديث بيانات الصورة في المستخدم
  user.profilePhoto = {
    url: result.data.secure_url,
    publicId: result.data.public_id,
  };

  await user.save();

  // حذف الملف المؤقت من السيرفر
  fs.unlinkSync(imagePath);

  res.status(200).json({
    message: "✅ Your profile photo uploaded successfully!",
    profilePhoto: user.profilePhoto,
  });
});




// DELETE user profile + صوره + منشوراته + تعليقاته (user or admin)
module.exports.deleteUser = asyncHandler(async (req, res) => {
  // جلب المستخدم
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // تحقق صلاحيات الحذف
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

 


  // حذف صورة الملف الشخصي من Cloudinary إن وجدت
  if (user.profilePhoto?.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

 

  // حذف المستخدم نفسه
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Your profile has been deleted successfully" });
});



// Get user count (admin only)
module.exports.getUserCount = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json({ count });
});



module.exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // تحقق الصلاحيات
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  // جلب المستخدم
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // مقارنة كلمة السر القديمة
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "❌ Old password is incorrect" });
  }

  // تشفير وتحديث كلمة السر الجديدة
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(200).json({ message: "✅ Password updated successfully" });
});
