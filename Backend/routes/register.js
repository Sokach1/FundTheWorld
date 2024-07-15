const express = require('express');
const router = express.Router();


// Require our controllers.
const reg_controller = require("../controllers/regController");

// router.get("/test",reg_controller.test);

/* 注册接口 */
router.post("/", reg_controller.register);


module.exports = router;