// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT c.*, u.name AS owner_name
    FROM wsk_cats AS c
    JOIN wsk_users AS u ON c.owner = u.user_id
  `);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT c.*, u.name AS owner_name
     FROM wsk_cats AS c
     JOIN wsk_users AS u ON c.owner = u.user_id
     WHERE c.cat_id = ?`,
    [id]
  );
  return rows[0] ?? false;
};

const listCatsByOwnerId = async (ownerId) => {
  const [rows] = await promisePool.execute(
    `SELECT c.*, u.name AS owner_name
     FROM wsk_cats AS c
     JOIN wsk_users AS u ON c.owner = u.user_id
     WHERE c.owner = ?`,
    [ownerId]
  );
  return rows;
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const [result] = await promisePool.execute(sql, params);
  console.log('result', result);
  if (result.affectedRows === 0) {
    return false;
  }
  return {cat_id: result.insertId};
};

const modifyCat = async (cat, id, actor) => {
  const allowedFields = ['cat_name', 'weight', 'filename', 'birthdate'];
  const entries = Object.entries(cat ?? {}).filter(([field]) =>
    allowedFields.includes(field)
  );

  if (entries.length === 0) {
    return false;
  }

  const assignments = entries.map(([field]) => `${field} = ?`).join(', ');
  const values = entries.map(([, value]) => value);
  const isAdmin = actor?.role === 'admin';
  const where = isAdmin ? 'cat_id = ?' : 'cat_id = ? AND owner = ?';
  const params = isAdmin ? [...values, id] : [...values, id, actor?.user_id];

  const [result] = await promisePool.execute(
    `UPDATE wsk_cats SET ${assignments} WHERE ${where}`,
    params
  );

  if (result.affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const removeCat = async (id, actor) => {
  const isAdmin = actor?.role === 'admin';
  const sql = isAdmin
    ? 'DELETE FROM wsk_cats WHERE cat_id = ?'
    : 'DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?';
  const params = isAdmin ? [id] : [id, actor?.user_id];

  const [result] = await promisePool.execute(sql, params);

  if (result.affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

export {
  listAllCats,
  findCatById,
  addCat,
  modifyCat,
  removeCat,
  listCatsByOwnerId,
};
