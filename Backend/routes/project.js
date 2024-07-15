const express = require('express');
const router = express.Router();

const project_controller = require("../controllers/projectController");


router.get("/test/:id/:cpid",project_controller.test);

/* 获取某一项目详细内容 */
router.get("/project_detail/:cpid", project_controller.projectDetail);

/* 获取某一项目所有评论 */
router.get("/project_comment/:cpid", project_controller.projectComment);

/* 创建一个新的项目 */
router.post("/createProject/:uid", project_controller.createProject);

/* 对一个项目捐款 */
router.post("/donateProject/:id/:cpid",project_controller.donateProject);

/* 对一个项目评论 */
router.post("/commentProject/:id/:cpid",project_controller.commentProject);

/* 修改项目状态 */
router.get("/projectStatus/:cpid/:sid",project_controller.changeStatus);

module.exports = router;
