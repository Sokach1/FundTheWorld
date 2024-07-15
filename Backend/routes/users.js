const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* Test. */
// router.get("/test",user_controller.test);

/* 上传头像 */
router.post("/uploadAvatar/:id",user_controller.uploadAvatar);

/* 取出指定用户的个人信息 */
router.get("/userinfo/id/:user_id",user_controller.userinfoId);

/* 取出指定地址用户的个人信息 */
router.get("/userinfo/address/:user_address",user_controller.userinfoAddr);

/* 修改指定用户的信息 */
router.post("/updateUserinfo/:user_id", user_controller.updateUserinfo);

/* 指定用户创建的项目 */
router.get("/projectCreated/:user_id", user_controller.projectCreated);

/* 指定用户捐赠的项目 */
router.get("/projectDonated/:user_id", user_controller.projectDonated);

module.exports = router;
