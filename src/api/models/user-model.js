import promisePool from '../../utils/database.js';
import bcrypt from 'bcrypt';

// In-memory sample data; changes are lost when the server restarts.

// Return the array of all users.
const listAllUsers = async () => {
  const [rows] = await promisePool.query(
    'SELECT user_id, name, username, email, role FROM wsk_users'
  );
  return rows;
};

// Find and return the user with a matching ID, or undefined if none matches.
const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT user_id, name, username, email, role FROM wsk_users WHERE user_id = ?',
    [id]
  );
  return rows[0] ?? false;
};

const findUserByUsername = async (username) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE username = ?',
    [username],
  );
  return rows[0] ?? false;
};

// Create the next ID, add the new user to the array, and return that ID.
const addUser = async (user) => {
  const {name, username, email, password, role = 'user'} = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await promisePool.execute(
    `INSERT INTO wsk_users (name, username, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [name, username, email, hashedPassword, role]
  );
  return result.insertId;
};

const modifyUser = async (user, id) => {
  const allowedFields = ['name', 'username', 'email', 'password', 'role'];
  const entries = Object.entries(user).filter(([field]) =>
    allowedFields.includes(field)
  );

  if (entries.length === 0) {
    return false;
  }

  const assignments = entries.map(([field]) => `${field} = ?`).join(', ');
  const values = await Promise.all(
    entries.map(async ([field, value]) =>
      field === 'password' ? bcrypt.hash(value, 10) : value
    )
  );
  const [result] = await promisePool.execute(
    `UPDATE wsk_users SET ${assignments} WHERE user_id = ?`,
    [...values, id]
  );

  return result.affectedRows > 0;
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);

    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Export model functions for use by the controller.
export {listAllUsers, findUserById, addUser, modifyUser, removeUser, findUserByUsername};
