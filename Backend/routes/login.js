const express = require('express');
const router = express.Router();

// Require our controllers.
const login_controller = require("../controllers/loginController");

router.get("/test",login_controller.test);

/* 登录接口 */
router.post("/",login_controller.login);

/* 退出登录接口 */
router.get("/logout", login_controller.logout);

module.exports = router;
