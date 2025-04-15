import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const cloudinary_obj = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

ffmpeg.setFfmpegPath(ffmpegPath);

const isVideo = (filePath) => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.flv'];
  const ext = path.extname(filePath).toLowerCase();
  return videoExtensions.includes(ext);
};

const isImage = (file) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype) {
    return file.mimetype.startsWith('image/');
  }

  return imageExtensions.includes(ext);
};

const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vcodec libx264', // Use H.264 video codec
        '-crf 28', // Quality scale (lower = better quality)
        '-preset fast' // Faster encoding
      ])
      .on('end', () => {
        console.log('Compression succeeded');
        resolve();
      })
      .on('error', (err) => {
        console.error('Compression error:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
};

export const uploadToCloudinary = async (filePath,folderName="temp", media_type = "") => {
    try {

      let resourceType = media_type || "video";
      let uploadPath = filePath;
      
      console.log(resourceType);

      if (isVideo(filePath)) {
        resourceType = 'video';
        
        console.log("got to comprasion")

        // Compress only if it's a video
        const compressedPath = './compressed-output' + path.extname(filePath);
        await compressVideo(filePath, compressedPath);
        uploadPath = compressedPath;

        console.log("comprased")
      }
  
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(uploadPath, {
        folder: folderName,
        resource_type: resourceType,
      });

      fs.unlinkSync(filePath);
      // console.log("Upload Success:", result);

      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
};

export const deletefromCloudinary = async (publicId) => {
    try {
        const res = await cloudinary.uploader.destroy(publicId);
        console.log(res);
        console.log("Deleted from Cloudinary:", publicId);
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
    }
};