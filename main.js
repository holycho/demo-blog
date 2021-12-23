var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var jwt = require('jsonwebtoken');
var db = require('./database');
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('secret', 'mySecret');

app.use(logger('dev'));
app.use(express.json()); // body-parser 於 Express 4 改為內建選項
app.use(express.urlencoded({ extended: false })); // body-parser 於 Express 4 改為內建選項
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

app.use('/', indexRouter);

app.get('/api/session', function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to authenticate token.',
                    errcode: 'AUTH_TOKEN_FAIL'
                });
                return;
            }

            res.json({
                success: true,
                message: 'User already login.'
            });
        })
    } else {
        res.json({
            success: false,
            message: 'No token provided.',
            errcode: 'NO_TOKEN'
        });
    }
})

app.post('/api/login', function (req, res, next) {
    if (!req.body.account && !req.body.password) {
        res.json({ success: false, message: 'Authenticate failed. No input', errcode: 'NO_INPUT' });
        return;
    }

    let _users = [];
    let sql = `SELECT * FROM account`;
    let params = [];
    db.all(sql, params, (error, rows) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Getting account failed',
                errcode: 'QUERY_ACCOUNT_FAILED'
            })
            return;
        }

        rows.map((it, index) => {
            _users.push({
                userId: it.acc_id,
                account: it.username,
                password: it.password
            })
        });

        let user = _users.find(it => it.account === req.body.account);
        if (!user) {
            res.json({ success: false, message: 'Authenticate failed. User not found', errcode: 'USER_NOT_FOUND' });
        } else {

            if (user.password !== req.body.password) {
                res.json({ success: false, message: 'Authenticate failed. Wrong password', errcode: 'WRONG_PASSWORD' });
            } else {
                // 要重開 nodemon 才會生效!
                var token = jwt.sign(user, app.get('secret'), {
                    // expiresIn: 60 * 60 * 24
                    expiresIn: "24h"
                });

                res.json({
                    success: true,
                    message: 'Create token successfully',
                    token: token,
                    userId: user.userId
                });
            }
        }
    });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;