const asyncHandler = require("express-async-handler");
const connection = require('../utils/db');

exports.test = asyncHandler(async (req, res) => {

    const username = 'admin1';
    connection.query(
        "SELECT * FROM administrator WHERE adname = ?",
        [username],
        (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                res.send(results)
            } else {
                res.status(401).json({ message: "账户或密码错误" });
            }
        }
    );

    //res.render("book_list", { title: "Book List", book_list: "allBooks" });
});

/* 登录 */
exports.login = asyncHandler(async (req, res) => {
    const {username,password}=req.body;
    connection.query(
        "SELECT * FROM user WHERE username = ? AND password = ?",
        [username, password],
        (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                req.session.user = results;
                res.send("Successful login!")
                //res.redirect("/users"); //重定向到user页面
            } else {
                res.status(401).json({ message: "Incorrect account or password!" });
            }
        }
    );
});

/* 退出登录 */
exports.logout = asyncHandler((req, res) => {
    // 清除session
    //req.session.destroy();
    //res.send("logout");
    res.redirect("/login");
    }
);
