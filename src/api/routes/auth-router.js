import express from 'express';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

const authRouter = express.Router();

authRouter.post(
  '/login',
  body('username')
    .trim()
    .isLength({min: 3, max: 20})
    .isAlphanumeric()
    .withMessage('Username must be 3–20 alphanumeric characters.'),
  body('password').isString().notEmpty().withMessage('Password is required.'),
  validationErrors,
  postLogin
);
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
