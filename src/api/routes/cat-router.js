import express from 'express';
import {getAllCats, getCatById, postCat} from '../controllers/cat-controller.js';

const catRouter = express.Router();

// Kaikki /api/v1/cats reitit
catRouter.route('/').get(getAllCats).post(postCat);
// Kaikki /api/v1/cats/:id reitit
catRouter.route('/:id').get(getCatById);

export default catRouter;
