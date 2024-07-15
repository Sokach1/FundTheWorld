const asyncHandler = require("express-async-handler");
const connection = require('../utils/db');
const multiparty = require('multiparty')
const fs = require('fs')

exports.test = asyncHandler(async (req, res) => {
    const u_id = req.params;
    res.send({u_id});
});


/* 上传头像 */
exports.uploadAvatar = asyncHandler(async (req, res) => {
    const u_id = req.params.id;

    let form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = './uploads'
    let newPath = '123';
    form.parse(req, function (err, fields, files) {
        try {
            console.log(files)
            console.log(files.avatar[0])
            console.log(fields)
            let inputFile = files.avatar[0];
            newPath = form.uploadDir + "/" + u_id + inputFile.originalFilename;
            // 同步重命名文件名 fs.renameSync(oldPath, newPath)
            //oldPath  不得作更改，使用默认上传路径就好
            fs.renameSync(inputFile.path, newPath);

            const query = 'UPDATE user SET avatar = ? WHERE uid = ?';
            const values = [newPath, Number(u_id)];

            connection.query(query, values, (err, result) => {
                if (err) throw err;
                console.log(`Affected rows: ${result.affectedRows}`);
            });

            res.send({data: "上传成功！"});
        } catch (err) {
            console.log(err);
            res.send(newPath);
        }
    });

});


/* 通过id获取用户信息 */
exports.userinfoId = asyncHandler(async (req, res) => {
    const userid = Number(req.params.user_id);
    connection.query(
        "SELECT * FROM user where uid = ?",
        [userid],
        (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                // 该用户的所有信息：results
                //console.log(results);
                res.send(results);
                //res.render(results);
            } else {
                res.status(401).json({ message: "账户错误" });
            }
        }
    );
});

/* 通过address获取用户信息 */
exports.userinfoAddr = asyncHandler(async (req, res) => {
    const user_address = req.params.user_address;
    // 检查 user_address 是否是有效的钱包地址（示例中简化为长度检查）
    if (user_address.length !== 42) { // 假设 Ethereum 钱包地址长度为 42
        return res.status(401).json({ message: "无效的钱包地址" });
    }
    connection.query(
        "SELECT * FROM user where address = ?",
        [user_address],
        (error, results) => {
            if (error) {
                console.error("数据库查询出错:", error);
                res.status(500).json({ message: "数据库查询出错" });
            }
            if (results.length > 0) {
                // 该用户的所有信息：results
                //console.log(results);
                res.status(200).json(results[0]); // 假设只返回第一个匹配的用户信息
                // res.send(results);
                //res.render(results);
            } else {
                res.status(404).json({ message: "未登记的用户，请录入详细信息" });
                // res.status(401).json({ message: "账户错误" });
            }
        }
    );
});


/* 修改用户信息 */
exports.updateUserinfo = asyncHandler(async (req, res) => {
    const userid = Number(req.params.user_id);

    const {pastPwd, newPwd, newTel, newEmail, newAddress} = req.body;

    if (newTel !== '' && newTel.length !== 11){
        res.send('Wrong telephone number format')
    }

    if (newEmail !== '' && !isValidEmail(newEmail)){
        res.send('Wrong email format!');
    }

    if (newAddress.length >= 50){
        res.send('Wrong address format!')
    }

    if (newPwd!= '' && !isStrongPassword(newPwd)){
        res.send('Weak Password!');
    }

    checkPassword(userid, pastPwd)
        .then((result) => {
            // 如果旧密码正确就修改相应不为空的项
            if (result > 0){
                if (newTel !== ''){
                    const query = 'UPDATE user SET tel = ? WHERE uid = ?';
                    const values = [newTel, Number(userid)];

                    connection.query(query, values, (err, result) => {
                        if (err) throw err;
                        console.log(`Affected rows: ${result.affectedRows}`);
                    });
                }

                if (newEmail !== '') {
                    const query = 'UPDATE user SET email = ? WHERE uid = ?';
                    const values = [newEmail, Number(userid)];

                    connection.query(query, values, (err, result) => {
                        if (err) throw err;
                        console.log(`Affected rows: ${result.affectedRows}`);
                    });
                }

                if (newAddress !== '') {
                    const query = 'UPDATE user SET address = ? WHERE uid = ?';
                    const values = [newAddress, Number(userid)];

                    connection.query(query, values, (err, result) => {
                        if (err) throw err;
                        console.log(`Affected rows: ${result.affectedRows}`);
                    });
                }

                if (newPwd !== '') {
                    const query = 'UPDATE user SET password = ? WHERE uid = ?';
                    const values = [newPwd, Number(userid)];

                    connection.query(query, values, (err, result) => {
                        if (err) throw err;
                        console.log(`Affected rows: ${result.affectedRows}`);
                    });
                }
                res.send('Update Successfully!')
            }
        });
});


exports.projectCreated = asyncHandler(async (req, res) => {
    const u_id = req.params.user_id;
    const query = 'select * from charity_projects WHERE uid = ?';
    const values = [Number(u_id)];

    connection.query(query, values, (err, result) => {
        if (err) throw err;
        // 该用户创建的所有项目数据：result
        res.send(result);
    });
});


exports.projectDonated = asyncHandler(async (req, res) => {
    const u_id = req.params.user_id;
    const query = `
        SELECT p.*
        FROM donations d
        JOIN charity_projects p ON d.cpid = p.cpid
        WHERE d.uid = ?
    `;
    const values = [Number(u_id)];

    connection.query(query, values, (err, result) => {
        if (err) throw err;
        // 该用户捐赠的所有项目数据：result
        res.send(result);
    });
});

function checkPassword(userid, pastPwd){
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM user WHERE uid = ? AND password = ?",
            [userid, pastPwd],
            (error, results, fields) => {
                resolve(results.length);
            }
        );
    });
}

// 密码强度检查函数
function isStrongPassword(password) {
    // 密码长度至少8位
    if (password.length < 8) {
        return false;
    }

    // 必须包含至少一个大写字母
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // 必须包含至少一个小写字母
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // 必须包含至少一个数字
    if (!/\d/.test(password)) {
        return false;
    }

    // 必须包含至少一个特殊字符
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }

    return true;
}

function isValidEmail(email) {
    // 使用正则表达式检查邮件地址是否含有 '@' 符号
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}
