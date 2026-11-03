// Import Express to create a router and the controller functions for each endpoint.
import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  postUser,
  putUser,
} from '../controllers/user-controller.js';

// A router groups related endpoint definitions.
const userRouter = express.Router();

// '/' is the mounted base path: GET lists users and POST creates a user.
userRouter.route('/').get(getAllUsers).post(postUser);
// ':id' captures a user ID from the URL for lookup, update, or delete.
userRouter.route('/:id').get(getUserById).put(putUser).delete(deleteUser);

// Export the router so the API can mount it under /users.
export default userRouter;