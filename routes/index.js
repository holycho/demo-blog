
var express = require('express');
var router = express.Router();
var db = require("../database.js");

router.get('/', function (req, res, next) {
    res.render('index', { title: `My Blog` });
});

router.get('/api/blogs/:user_id', function (req, res, next) {
    var sql = "SELECT * FROM blog WHERE user_id = ?"
    var params = [req.params.user_id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

router.get('/api/blog/:id', function (req, res, next) {
    var sql = "SELECT * FROM blog WHERE id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        // console.log(err, row)
        if (err) {
            res.status(400).json({
                "errer": err.message
            });
            return;
        }
        if (!row) {
            res.status(400).json({
                "errer": `Blog id: ${req.params.id} does not exist`
            });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

router.post('/api/blog', function (req, res, next) {
    let errors = [];
    // get fields from body
    if (!req.body.title) {
        errors.push('No title specified');
    }
    if (!req.body.content) {
        errors.push('No content specified');
    }
    if (!req.body.user_id) {
        errors.push('No user specified');
    }
    if (errors.length > 0) {
        res.status(400).json({
            "error": errors.join(",")
        })
        return;
    }
    var sql = `INSERT INTO blog (title,content,created,updated,user_id) VALUES (?,?,datetime('now','localtime'),datetime('now','localtime'),?)`;
    var params = [req.body.title, req.body.content, req.body.user_id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }

        db.get(`SELECT * FROM blog WHERE id = ?`, [this.lastID], (err, data) => {
            if (err) {
                res.status(400).json({
                    "error": err.message
                });
                return;
            }

            // console.log('inserted data: ', data);
            res.json({
                "message": "success",
                "data": {
                    title: req.body.title,
                    content: req.body.content,
                    updated: data.updated,
                    created: data.created,
                    user_id: req.body.user_id
                },
                "id": this.lastID
            });
        })
    })
});

router.patch('/api/blog/:id', function (req, res, next) {
    var sql = `UPDATE blog SET title=COALESCE(?,title),content=COALESCE(?,content),updated=datetime('now','localtime') WHERE id=?`;
    var params = [req.body.title, req.body.content, req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }

        db.get(`SELECT * FROM blog WHERE id = ?`, [req.params.id], (err, data) => {
            if (err) {
                res.status(400).json({
                    "error": err.message
                });
                return;
            }

            // console.log('updated data: ', data);
            res.json({
                "message": "success",
                "data": {
                    title: data.title,
                    content: data.content,
                    updated: data.updated,
                    created: data.created
                },
                "id": data.id
            });
        })
    })
});

router.delete('/api/blog/:id', function (req, res, next) {
    var countSql = `SELECT COUNT(*) as total FROM blog WHERE id=?`;
    // get(): 取得執行結果
    db.get(countSql, req.params.id, function (err, result) {
        if (err) {
            res.status(400).json({
                "error": err.message
            });
            return;
        }
        // console.log(result)
        if (result.total === 0) {
            res.status(400).json({
                "errer": `Blog id: ${req.params.id} does not exist`
            });
            return;
        }

        var sql = 'DELETE FROM blog WHERE id=?';
        // run(): 執行 sql 語法指令
        db.run(sql, req.params.id, function (err, result) {
            if (err) {
                res.status(400).json({
                    "error": err.message
                });
                return;
            }
            res.json({
                "message": "success",
                "changes": `blog id: ${req.params.id} is deleted`,
                "id": req.params.id
            });
        })
    })
});

router.get('/api/account', function (req, res, next) {
    var sql = `SELECT * FROM account`;
    var params = [];
    db.all(sql, params, (error, rows) => {
        if (error) {
            res.status(500).json({
                "error": error.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
})

router.post('/api/account', function (req, res, next) {
    let errors = [];
    // get fields from body
    if (!req.body.username) {
        errors.push('No username specified');
    }
    if (!req.body.password) {
        errors.push('No password specified');
    }
    if (errors.length > 0) {
        res.status(400).json({
            error: errors.join(", "),
            errcode: "BAD_REQUEST"
        })
        return;
    }
    if (req.body.username === "admin") {
        res.status(400).json({
            error: `Account: \'admin\' is the default one`,
            errcode: "DEFAULT_ACCOUNT"
        })
        return;
    }

    var countSql = `SELECT COUNT(*) as total FROM account WHERE username=?`;
    db.get(countSql, req.body.username, function (err, result) {
        if (err) {
            res.status(400).json({
                error: err.message,
                errcode: "QUERY_ACCOUNT_FAIL"
            });
            return;
        }
        // console.log(`${req.body.username}\'s total count: `, result.total);
        if (result.total > 0) {
            res.status(400).json({
                error: `account: \'${req.body.username}\' already exists`,
                errcode: "DUPLICATE_ACCOUNT"
            });
            return;
        }

        // Insert
        var sql = `INSERT INTO account (username,password,created_time,updated_time) VALUES (?,?,datetime('now','localtime'),datetime('now','localtime'))`;
        var params = [req.body.username, req.body.password];
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(400).json({
                    error: err.message,
                    errcode: "INSERT_ACCOUNT_FAIL"
                });
                return;
            }

            db.get(`SELECT * FROM account WHERE acc_id = ?`, [this.lastID], (err, data) => {
                if (err) {
                    res.status(400).json({
                        error: err.message,
                        errcode: "INSERT_ACCOUNT_FAIL"
                    });
                    return;
                }

                console.log('inserted data: ', data);
                res.json({
                    "message": "success",
                    "data": {
                        username: req.body.username,
                        updated: data.updated,
                        created: data.created
                    },
                    "acc_id": this.lastID
                });
            })
        })
    });
});

module.exports = router;