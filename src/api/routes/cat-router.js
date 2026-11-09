import {authenticateToken} from '../../middlewares/authentication.js';
import express from 'express';
import {
  deleteCat,
  getAllCats,
  getCatById,
  postCat,
  putCat,
  getCatsByUserId,
} from '../controllers/cat-controller.js';
import logger from '../../middlewares/logger.js';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

// multer and sharp imports
import {upload, createThumbnail} from '../../middlewares/upload.js';

const catRouter = express.Router();

// Kaikki /api/v1/cats reitit
catRouter
  .route('/')
  .get(logger, getAllCats)
  .post(
    authenticateToken,
    upload.single('image'),
    body('cat_name')
      .trim()
      .isLength({min: 3, max: 50})
      .withMessage('Cat name must be 3–50 characters.'),
    body('weight')
      .isFloat({gt: 0})
      .withMessage('Weight must be a positive number.')
      .toFloat(),
    body('birthdate').isDate().withMessage('Birthdate must be a valid date.'),
    validationErrors,
    createThumbnail,
    postCat
  );
// Kaikki /api/v1/cats/:id reitit
catRouter.get('/by-user/:userId', getCatsByUserId);
catRouter
  .route('/:id')
  .get(getCatById)
  .delete(authenticateToken, deleteCat)
  .put(
    authenticateToken,
    body('cat_name')
      .optional()
      .trim()
      .isLength({min: 3, max: 50})
      .withMessage('Cat name must be 3–50 characters.'),
    body('weight')
      .optional()
      .isFloat({gt: 0})
      .withMessage('Weight must be a positive number.')
      .toFloat(),
    body('birthdate')
      .optional()
      .isDate()
      .withMessage('Birthdate must be a valid date.'),
    validationErrors,
    putCat
  );

export default catRouter;

// Expressin middleware on kerros, joka käsittelee pyyntöä
// ennen kuin se pääsee reitille tai komtrolleriin

// 1. lisätään ensin oma tyhmä logger middleware
// reittikohtainen esimerkki

// 2. kaikille reiteillle on määritelty request time middleware joka saa muuttaa req objektia

// 3. Varsinainen tehtävänanto on käyttää Multeria
//  Multer on yksi tällainen middleware, joka osaa lukea multipart/form-data -pyynnöt ja tallentaa tiedostot serverille

// Myöhemmin lisätään esim. autentikointi, virheenkäsittely.

// upload.single('file'):
// tallentaa tiedoston esim. uploads/-kansioon ja
// lisää req.file-olion, jossa on esim.:

// {
//   fieldname: 'file',           // formin "name"
//   originalname: 'image.jpg',   // alkuperäinen nimi
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',     // mihin tallennettiin
//   filename: 'a8f9234bd12.jpg', // generoitu nimi levyllä
//   path: 'uploads/a8f9234bd12.jpg',
//   size: 12345
// }

// Kaikki muut kentät (cat_name, weight, …) menevät  req.body-olioon.
