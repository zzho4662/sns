const express = require("express");
const auth = require("../middleware/auth");
const { follow } = require("../controller/follows");

const router = express.Router();

// api/v1/follows
router.route("/").post(auth, follow);

module.exports = router;
