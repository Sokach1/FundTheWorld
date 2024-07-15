const express = require('express');
const router = express.Router();

const mainpage_controller = require("../controllers/mainpageController");


router.get("/test",mainpage_controller.test);


/* 获取所有项目内容 */
router.get("/getProjects",mainpage_controller.getProjects);

/* 获取分类项目内容 */
router.get("/projectsClass/:cid",mainpage_controller.getclassProjects);

module.exports = router;
