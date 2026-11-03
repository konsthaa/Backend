// Import model functions that read and add users.
import {addUser, findUserById, listAllUsers} from '../models/user-model.js';

// Handle GET /users and send the full user list as JSON.
const getAllUsers = (req, res) => {
  res.json(listAllUsers());
};

// Handle GET /users/:id; URL parameters arrive as strings, so convert the ID to a number.
const getUserById = (req, res) => {
  const user = findUserById(Number(req.params.id));
  // Return a 404 response when the model cannot find that ID.
  if (!user) {
    return res.status(404).json({message: 'User not found.'});
  }
  res.json(user);
};

// Handle POST /users using the JSON request body, then respond with the new ID.
const postUser = (req, res) => {
  const id = addUser(req.body);
  res.status(201).json({user_id: id});
};

// These endpoints intentionally return the fixed responses required by the assignment.
const putUser = (req, res) => {
  res.json({message: 'User item updated.'});
};

const deleteUser = (req, res) => {
  res.json({message: 'User item deleted.'});
};

// Export handlers so the router can connect them to HTTP methods and paths.
export {getAllUsers, getUserById, postUser, putUser, deleteUser};