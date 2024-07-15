const asyncHandler = require("express-async-handler");
const connection = require('../utils/db');

exports.test = asyncHandler(async (req, res) => {
    res.send('cool')
    });

/* 注册 */
exports.register = asyncHandler(async (req, res) => {
    const {username, password, tel, email, address} = req.body;
    //初始头像
    const avatar = './uploads/momo.jpg'
    if (!isStrongPassword(password)) {
        res.send('Weak Password!');
    } else if (!isValidEmail(email)) {
        res.send('Wrong email format!');
    } else if (tel.length !== 11) {
        res.send('Wrong telephone number format!')
    } else if (address.length >= 50) {
        res.send('Wrong address format!')
    } else {
        isValidUsername(username).then((r) => {
            if (r > 0) {
                res.send('This username already exists!');
            } else {
                const columnName = 'uid';
                const tableName = 'user';

                getMaxvalue(columnName, tableName)
                    .then((maxValue) => {
                        const newMaxValue = maxValue + 1;

                        //插入新数据
                        const newData = {
                            uid: newMaxValue,
                            username: username,
                            password: password,
                            tel: tel,
                            email: email,
                            address: address,
                            avatar: avatar
                        };

                        const sql = 'INSERT INTO user SET ?';
                        // 执行 SQL 查询
                        connection.query(sql, newData, (err, result) => {
                            if (err) throw err;
                            console.log('New data inserted. ID:', result.insertId);
                        });
                    });
            }
        });
    }
    res.send('Register successfully!');
});

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

function isValidUsername(username) {
    // 从数据库查找是否有重名
    const query = 'SELECT * FROM user WHERE username = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [username], (err, results) => {
            if (err) {
                console.error('Error querying database: ', err);
                res.status(500).json({error: '服务器错误'});
            }
            const r = results.length;
            resolve(r);
        });
    });
}


function getMaxvalue(columnName, tableName){
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT MAX(${columnName}) AS max_value FROM ${tableName}`,
            (error, results, fields) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({error: '获取最大值失败'});
                }
                const maxUid = results[0].max_value;
                // maxValue的类型为number
                resolve(maxUid);
            }
        );
    });
}