const { randomInt } = require("crypto");
const util = require("util");
const gc = require("./config/gc");
const bucket = gc.bucket(`${process.env.STORAGE_BUCKET_NAME}`); // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file, directory) =>
  new Promise((resolve, reject) => {
    const { buffer, mimetype } = file;
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (validImageTypes.includes(mimetype)) {
      const blob = bucket.file(`${directory}`);
      const blobStream = blob.createWriteStream({
        gzip: true,
        resumable: false,
      });
      blobStream
        .on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${directory}?ignoreCache=${randomInt(0, 1000000000)}`;
          resolve(publicUrl);
        })
        .on("error", (err) => {
          console.log(err);
          reject(`Unable to upload image, something went wrong`);
        })
        .end(buffer);
    } else {
      reject("Invalid image type: " + mimetype);
    }
  });

module.exports = {
  uploadImage,
};
