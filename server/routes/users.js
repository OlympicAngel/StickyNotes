const { registerUser, login } = require("../controller/user.controller")
const express = require('express');
const router = express.Router();


router.post('/', registerUser);
router.post("/login", login)


module.exports = router;