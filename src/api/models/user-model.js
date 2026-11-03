// In-memory sample data; changes are lost when the server restarts.
const users = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3610,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@metropolia.fi',
    role: 'user',
    password: 'password',
  },
];

// Return the array of all users.
const listAllUsers = () => users;

// Find and return the user with a matching ID, or undefined if none matches.
const findUserById = (id) => users.find((user) => user.user_id === id);

// Create the next ID, add the new user to the array, and return that ID.
const addUser = (user) => {
  // Spread (...) passes each existing user ID to Math.max.
  const newId = Math.max(...users.map((item) => item.user_id)) + 1;
  // Spread the submitted fields, then set the server-generated ID.
  users.push({...user, user_id: newId});
  return newId;
};

// Export model functions for use by the controller.
export {listAllUsers, findUserById, addUser};