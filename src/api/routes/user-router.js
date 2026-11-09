// Import Express to create a router and the controller functions for each endpoint.
import express from 'express';
import {authenticateToken} from '../../middlewares/authentication.js';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  postUser,
  putUser,
} from '../controllers/user-controller.js';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

// A router groups related endpoint definitions.
const userRouter = express.Router();

// '/' is the mounted base path: GET lists users and POST creates a user.
userRouter
  .route('/')
  .get(getAllUsers)
  .post(
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').trim().isEmail().withMessage('A valid email is required.'),
    body('username')
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric()
      .withMessage('Username must be 3–20 alphanumeric characters.'),
    body('password')
      .isString()
      .isLength({min: 8})
      .withMessage('Password must be at least 8 characters.'),
    validationErrors,
    postUser
  );
// ':id' captures a user ID from the URL for lookup, update, or delete.
userRouter
  .route('/:id')
  .get(getUserById)
  .put(
    authenticateToken,
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty.'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('A valid email is required.'),
    body('username')
      .optional()
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric()
      .withMessage('Username must be 3–20 alphanumeric characters.'),
    body('password')
      .optional()
      .isString()
      .isLength({min: 8})
      .withMessage('Password must be at least 8 characters.'),
    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be user or admin.'),
    validationErrors,
    putUser
  )
  .delete(authenticateToken, deleteUser);

// Export the router so the API can mount it under /users.
export default userRouter;
