import { v2 } from 'cloudinary';
import dotenv from 'dotenv';
import responseHandlers from './responseHandlers';
import messages from './customMessages';
import statusCodes from './statusCodes';

const { errorResponse } = responseHandlers;

dotenv.config();

/**
 * @param{file} image
 * @param {object} req
 * @returns{string} image url
 * @description this function uploadImage() helps to upload images to cloudinary
 */
const uploadImage = async (image, req) => {
    v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
     await v2.uploader.upload(image.tempFilePath, (err, uploadResult) => {        
        req.body.myImage = uploadResult.url;
     });
};

/**
 * 
 * @param {object} req 
 * @returns {object} if the profile pic passed in request body, 
 * then it adds it on request body
 */
const profilePicPassed = (req) => {
  if (req.files && req.files.myImg) {
    const { myImg } = req.files;
    req.newImgToUpload = myImg;
  }
};


/**
 * @param {file} newImgToUpload 
 * @returns {object} next is
 * @description this function isProfilePicExtValid evaluate the extensions of profile picture
 */
const isProfilePicExtValid = (newImgToUpload) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    let isFound = false;
    for (let i = 0; i < allowedExtensions.length; i += 1) {
      if (newImgToUpload.name.includes(allowedExtensions[i])) {
        isFound = true;
        break;
      } 
    }
    return isFound;
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns{object} it uploads a profile pic if it is there
 */
const uploadImg = async (req, res) => {
  profilePicPassed(req);
  if (req.newImgToUpload) {
    const { newImgToUpload } = req;
    if (isProfilePicExtValid(newImgToUpload)) {
      await uploadImage(newImgToUpload, req);
    } else {
      errorResponse(res, statusCodes.unsupportedMediaType, messages.invalidPictureExt);
    }
  }
};
export default uploadImg;
