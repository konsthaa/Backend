// Import model functions that read and add users.
import {addUser, findUserById, listAllUsers, modifyUser, removeUser} from '../models/user-model.js';

// Handle GET /users and send the full user list as JSON.
const getAllUsers = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

// Handle GET /users/:id; URL parameters arrive as strings, so convert the ID to a number.
const getUserById = async (req, res) => {
  const user = await findUserById(Number(req.params.id));
  // Return a 404 response when the model cannot find that ID.
  if (!user) {
    return res.status(404).json({message: 'User not found.'});
  }
  res.json(user);
};

// Handle POST /users using the JSON request body, then respond with the new ID.
const postUser = async (req, res) => {
  const {name, username, email, password} = req.body ?? {};
  if (![name, username, email, password].every(
    (value) => typeof value === 'string' && value.trim(),
  )) {
    return res.status(400).json({
      message: 'Name, username, email, and password are required.',
    });
  }

  const id = await addUser(req.body);
  res.status(201).json({user_id: id});
};

const putUser = async (req, res) => {
  const updated = await modifyUser(req.body, Number(req.params.id));
  if (!updated) {
    return res.status(404).json({message: 'User not found.'});
  }
  res.json({message: 'User updated.'});
};

// These endpoints intentionally return the fixed responses required by the assignment.


const deleteUser = async (req, res) => {
  const deleted = await removeUser(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({message: 'User not found.'});
  }
  res.json({message: 'User and their cats deleted.'});
};

// Export handlers so the router can connect them to HTTP methods and paths.
export {getAllUsers, getUserById, postUser, putUser, deleteUser};
