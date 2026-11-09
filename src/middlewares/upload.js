//KATSOTAAN ULLAN PUSHIT GITHUBISTA, TEHTÄVÄ OSITTAIN TEHTYNÄ SIELLÄ.
import sharp from 'sharp';
import path from 'node:path';
import multer from 'multer';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
      return;
    }

    const error = new Error('Only images and videos are allowed.');
    error.status = 400;
    cb(error);
  },
});

const createThumbnail = async (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    next();
    return;
  }

  console.log(req.file.path);
  const thumbnailPath = path.join(
    req.file.destination,
    `${req.file.filename}_thumb.png`
  );

  try {
    await sharp(req.file.path).resize(160, 160).png().toFile(thumbnailPath);

    next();
  } catch (error) {
    next(error);
  }
};

export {upload, createThumbnail};
