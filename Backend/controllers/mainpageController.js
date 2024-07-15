const asyncHandler = require("express-async-handler");
const connection = require('../utils/db');

exports.test = asyncHandler(async (req, res) => {
    res.send('Mainpage cool!')
});

/* 获取所有项目内容 */
exports.getProjects = asyncHandler(async (req, res) => {
    connection.query(
        "SELECT * FROM charity_projects",
        (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                res.send(results)
                //res.render(results);
            } else {
                res.status(401).json({ message: "error" });
            }
        }
    );
});

/* 获取分类项目内容 */
exports.getclassProjects = asyncHandler(async (req, res) => {
    const cid = Number(req.params.cid);
    connection.query(
        "SELECT * FROM charity_projects where pclass = ?",
        [cid],
        (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                res.send(results)
                //res.render(results);
            } else {
                res.status(401).json({ message: "error" });
            }
        }
    );
});




