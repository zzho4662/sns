const path = require("path");
const connection = require("../db/mysql_connection");

// @desc        친구 맺기
// @route       POST /api/v1/follows
// @request     user_id(auth), friend_user_id
// @response    success
exports.follow = async (req, res, next) => {
  let user_id = req.user.id;
  let friend_user_id = req.body.friend_user_id;

  if (!user_id || !friend_user_id) {
    res.status(400).json({ message: "파라미터가 잘못 되었습니다." });
    return;
  }

  // table에 unique 를 활용한다.
  let query =
    "insert into photo_follow (user_id, friend_user_id) \
                    values ? ";
  let data = [
    [user_id, friend_user_id],
    [friend_user_id, user_id],
  ];

  try {
    [result] = await connection.query(query, [data]);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};
