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

const modifyCat = async (cat, id) => {
  const sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
    cat,
    id,
  ]);
  const [result] = await promisePool.execute(sql);
  console.log('result', result);
  if (result.affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const removeCat = async (id) => {
  const [result] = await promisePool.execute(
    'DELETE FROM wsk_cats WHERE cat_id = ?',
    [id]
  );
  console.log('result', result);
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
