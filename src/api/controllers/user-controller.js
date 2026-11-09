// Import model functions that read and add users.
import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

// Handle GET /users and send the full user list as JSON.
const getAllUsers = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

// Handle GET /users/:id; URL parameters arrive as strings, so convert the ID to a number.
const getUserById = async (req, res, next) => {
  const user = await findUserById(Number(req.params.id));
  // Return a 404 response when the model cannot find that ID.
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    return next(error);
  }
  res.json(user);
};

// Handle POST /users using the JSON request body, then respond with the new ID.
const postUser = async (req, res) => {
  const id = await addUser(req.body);
  res.status(201).json({user_id: id});
};

const putUser = async (req, res, next) => {
  const id = Number(req.params.id);
  const actor = res.locals.user;

  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('Invalid user ID.');
    error.status = 400;
    return next(error);
  }

  if (!actor || (actor.role !== 'admin' && actor.user_id !== id)) {
    return res.sendStatus(403);
  }

  if (
    actor.role !== 'admin' &&
    Object.prototype.hasOwnProperty.call(req.body ?? {}, 'role')
  ) {
    return res.sendStatus(403);
  }

  const updated = await modifyUser(req.body, id, actor);
  if (!updated) {
    const error = new Error('User not found.');
    error.status = 404;
    return next(error);
  }
  res.json({message: 'User updated.'});
};

const deleteUser = async (req, res, next) => {
  const id = Number(req.params.id);
  const actor = res.locals.user;

  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('Invalid user ID.');
    error.status = 400;
    return next(error);
  }

  if (!actor || (actor.role !== 'admin' && actor.user_id !== id)) {
    return res.sendStatus(403);
  }

  const deleted = await removeUser(id);
  if (!deleted) {
    const error = new Error('User not found.');
    error.status = 404;
    return next(error);
  }
  res.json({message: 'User and their cats deleted.'});
};

// Export handlers so the router can connect them to HTTP methods and paths.
export {getAllUsers, getUserById, postUser, putUser, deleteUser};
