const asyncHandler = require("express-async-handler");
const multiparty = require('multiparty')
const fs = require('fs')
const connection = require("../utils/db");


exports.test = asyncHandler(async (req, res) => {
    const u_id = req.params.id;
    const cp_id = req.params.cpid;
    res.send({u_id, cp_id});
});


/* 获取某一项目详细内容 */
exports.projectDetail = asyncHandler(async (req, res) => {
    const cp_id = req.params.cpid;
    const query = 'select * from charity_projects WHERE cpid = ?';
    const values = [Number(cp_id)];

    connection.query(query, values, (err, result) => {
        if (err) throw err;
        //result为返回结果，包含一个项目的所有信息
        res.send(result);
    });
});


/* 获取某一项目所有评论 */
exports.projectComment = asyncHandler(async (req, res) => {
    const cp_id = req.params.cpid;
    const query = 'select * from comments WHERE cpid = ?';
    const values = [Number(cp_id)];

    connection.query(query, values, (err, result) => {
        if (err) throw err;
        //result为返回结果，包含一个项目的所有信息
        res.send(result);
    });
});


/* 创建一个新的项目 */
exports.createProject = asyncHandler(async (req, res) => {
    const u_id = req.params.uid;
    const currentDate = new Date().toISOString().slice(0, 10);

    let form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = './project_upload'
    let imgPath1 = '123';
    let imgPath2 = '123';
    let imgPath3 = '123';
    form.parse(req, function (err, fields, files) {
        // console.log(files)
        // console.log(files.imgs[0])
        console.log(fields)
        console.log(fields['project_name'][0])
        // console.log(typeof fields['project_name'][0])

        const columnName = 'cpid';
        const tableName = 'charity_projects';

        getMaxid(columnName, tableName)
            .then((maxValue) => {
                const newcpid = maxValue + 1;

                let inputFile = files.imgs[0];
                imgPath1 = form.uploadDir + "/" + newcpid + inputFile.originalFilename;
                // // 同步重命名文件名 fs.renameSync(oldPath, newPath)
                fs.renameSync(inputFile.path, imgPath1);

                inputFile = files.imgs[1];
                imgPath2 = form.uploadDir + "/" + newcpid + inputFile.originalFilename;
                fs.renameSync(inputFile.path, imgPath2);

                inputFile = files.imgs[2];
                imgPath3 = form.uploadDir + "/" + newcpid + inputFile.originalFilename;
                fs.renameSync(inputFile.path, imgPath3);

                //插入新数据
                const newData = {
                    cpid: newcpid,
                    uid: u_id,
                    cproject_name: fields['project_name'][0],
                    timestamp: currentDate,
                    end_date: fields['end_date'][0],
                    total_amount: Number(fields['total_amount'][0]),
                    current_amount: 0,
                    description: fields['description'][0],
                    status: fields['status'][0],
                    img1: imgPath1,
                    img2: imgPath2,
                    img3: imgPath3,
                    pclass: Number(fields['pclass'][0]),
                    cp_account: fields['cp_account'][0]
                };

                const sql = 'INSERT INTO charity_projects SET ?';
                // 执行 SQL 查询
                connection.query(sql, newData, (err, result) => {
                    if (err) throw err;
                    console.log('New data inserted. ID:', result.insertId);
                });
            });

    });
    res.send('Create Successfully!');
});


/* 对一个项目捐款 */
exports.donateProject = asyncHandler(async (req, res) => {
    const u_id = req.params.id;
    const cp_id = req.params.cpid;
    const currentDate = new Date().toISOString().slice(0, 10);
    const columnName = 'd_id';
    const tableName = 'donations';

    let form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.parse(req, function (err, fields, files) {
        // damount是表单要传来的值，命名必须为amount
        const damount = Number(fields['amount'][0]);
        getMaxid(columnName, tableName)
            .then((maxValue) => {
                const newdid = maxValue + 1;

                //插入新数据
                const newData = {
                    d_id: newdid,
                    uid: u_id,
                    cpid: cp_id,
                    amount: damount,
                    timestamp: currentDate
                };

                const sql = 'INSERT INTO donations SET ?';
                // 执行 SQL 查询
                connection.query(sql, newData, (err, result) => {
                    if (err) throw err;
                    console.log('New data inserted. ID:', result.insertId);
                });

            });

        // 更新charity_project表，amount增加
        const query = `
        UPDATE charity_projects
        SET current_amount = current_amount + ?
        WHERE cpid = ? `;

        connection.query(query, [damount, cp_id], (err, result) => {
            if (err) throw err;
            console.log(`${result.affectedRows} row(s) updated`);
        });
    });

    res.send('Donate Successfully!');
});


/* 对一个项目评论 */
exports.commentProject = asyncHandler(async (req, res) => {
    const u_id = req.params.id;
    const cp_id = req.params.cpid;
    const currentDate = new Date().toISOString().slice(0, 10);
    const columnName = 'c_id';
    const tableName = 'comments';

    let form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.parse(req, function (err, fields, files) {
        const newComment = fields['comment'][0];

        getMaxid(columnName, tableName)
            .then((maxValue) => {
                const newcid = maxValue + 1;

                //插入新数据
                const newData = {
                    c_id: newcid,
                    timestamp: currentDate,
                    details: newComment,
                    uid: u_id,
                    cpid: cp_id
                };

                const sql = 'INSERT INTO comments SET ?';
                // 执行 SQL 查询
                connection.query(sql, newData, (err, result) => {
                    if (err) throw err;
                    console.log('New data inserted. ID:', result.insertId);
                });

            });
    });
    res.send('Comment Successfully!');
});


/* 修改项目状态 */
exports.changeStatus = asyncHandler(async (req, res) => {
    const cp_id = req.params.cpid;
    const status = req.params.sid;
    // 更新charity_project表，项目status改变
    const query = `
        UPDATE charity_projects
        SET status = ?
        WHERE cpid = ? `;

    connection.query(query, [status, cp_id], (err, result) => {
        if (err) throw err;
        console.log(`${result.affectedRows} row(s) updated`);
    });

    res.send('Change Successfully')
});


function getMaxid(columnName, tableName){
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
