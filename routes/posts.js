const express = require("express");
const auth = require("../middleware/auth");
const {
  updatePost,
  deletePost,
  uploadPhoto,
  getMyPosts,
  getFriendsPost,
} = require("../controller/posts");

const router = express.Router();

router.route("/").post(auth, uploadPhoto);
router.route("/").get(auth, getMyPosts);
router.route("/:post_id").put(auth, updatePost);
router.route("/:post_id").delete(auth, deletePost);
router.route("/friend").get(auth, getFriendsPost);

module.exports = router;
