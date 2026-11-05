import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {findUserByUsername} from '../models/user-model.js';

const postLogin = async (req, res) => {
  const {username, password} = req.body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res
      .status(400)
      .json({message: 'Username and password are required.'});
  }

  const user = await findUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.sendStatus(401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const userWithoutPassword = {
    user_id: user.user_id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({user: userWithoutPassword, token});
};

const getMe = (req, res) => {
  if (!res.locals.user) {
    return res.sendStatus(401);
  }
  res.json({message: 'token ok', user: res.locals.user});
};

export {postLogin, getMe};
