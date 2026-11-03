//KATSOTAAN ULLAN PUSHIT GITHUBISTA, TEHTÄVÄ OSITTAIN TEHTYNÄ SIELLÄ.
import sharp from 'sharp';
import path from 'node:path';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  console.log(req.file.path);
    const thumbnailPath = path.join(
    req.file.destination,
    `${req.file.filename}_thumb.png`,
  );

  try {
    await sharp(req.file.path)
      .resize(160, 160)
      .png()
      .toFile(thumbnailPath);

    next();
  } catch (error) {
    next(error);
  }
};

export {createThumbnail};
