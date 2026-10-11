const cloudinary = require('cloudinary').v2;
const config = require('./env');

let configured = false;

function configureCloudinary() {
  if (!config.cloudinaryUser || !config.cloudinaryKey || !config.cloudinarySecret) {
    const error = new Error('Cloudinary is not configured.');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: config.cloudinaryUser,
      api_key: config.cloudinaryKey,
      api_secret: config.cloudinarySecret,
      secure: true,
    });
    configured = true;
  }
}

function uploadPhoto(buffer) {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'fotos_usuarios_recruters_examples', resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result?.secure_url) {
          return reject(new Error('Cloudinary returned no secure image URL.'));
        }
        return resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

module.exports = uploadPhoto;
