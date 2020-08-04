const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const connection = require("../db/mysql_connection");

// @desc    회원가입
// @route   POST    /api/v1/users
// @parameters  email, passwd
exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  // npm validator
  if (!validator.isEmail(email)) {
    res.status(400).json();
    return;
  }

  // npm bcryptjs
  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = "insert into sns_user (email, passwd) values ( ? , ? )";
  let data = [email, hashedPasswd];
  let user_id;

  const conn = await connection.getConnection();
  await conn.beginTransaction();

  try {
    [result] = await conn.query(query, data);
    user_id = result.insertId;
  } catch (e) {
    await conn.rollback();
    res.status(500).json();
    return;
  }

  // 토큰 처리  npm jsonwebtoken
  // 토큰 생성 sign
  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into sns_token (token, user_id) values (? , ? )";
  data = [token, user_id];

  try {
    [result] = await conn.query(query, data);
  } catch (e) {
    await conn.rollback();
    res.status(500).json();
    return;
  }

  await conn.commit();
  await conn.release();

  res.status(200).json({ success: true, token: token });
};

// @desc        로그인
// @route       POST    /api/v1/users/login
// @parameters  email, passwd
exports.loginUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  let query = "select * from sns_user where email = ? ";
  let data = [email];

  let user_id;
  try {
    [rows] = await connection.query(query, data);
    let hashedPasswd = rows[0].passwd;
    user_id = rows[0].id;
    const isMatch = await bcrypt.compare(passwd, hashedPasswd);
    if (isMatch == false) {
      res.status(401).json();
      return;
    }
  } catch (e) {
    res.status(500).json();
    return;
  }
  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into sns_token (token, user_id) values (?, ?)";
  data = [token, user_id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, token: token });
  } catch (e) {
    res.status(500).json();
  }
};

// @desc    로그아웃 (현재의 기기 1개에 대한 로그아웃)
// @route   /api/v1/users/logout

exports.logout = async (req, res, next) => {
  // movie_token 테이블에서, 토큰 삭제해야 로그아웃이 되는것이다.

  let user_id = req.user.id;
  let token = req.user.token;

  let query = "delete from sns_token where user_id = ? and token = ? ";
  let data = [user_id, token];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json();
  }
};
