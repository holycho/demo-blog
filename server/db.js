var sqlite3 = require("sqlite3").verbose();

/** 資料庫名稱 */
const DB_SOURCE = ".db.sqlite";
/** Account Table */
const ACCOUNT = "account";
/** Blog Table */
const BLOG = "blog";

/**
 * 取得建立 Account Table 之 SQL 字串
 * @returns sql string
 */
function createAccoutTableSql () {
    return `CREATE TABLE ${ACCOUNT} (
        acc_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NUT NULL,
        password TEXT NOT NULL,
        created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`;
};

/**
 * 取得建立 Blog Table 之 SQL 字串 (依於 Account 帳號)
 * @returns sql string
 */
function createBlogTableSql () {
    return `CREATE TABLE ${BLOG} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT,
        content TEXT,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES account(acc_id) ON UPDATE CASCADE
    )`;
};

/**
 * 取得以某欄位來查詢 Account Table 之 SQL 字串
 * @returns sql string
 */
function countAccountSql (fieldName) {
    return `SELECT COUNT(*) as total FROM account WHERE ${fieldName}=?`;
};

/**
 * 取得 Account Table 新增帳號之 SQL 字串
 * @returns sql string
 */
function insertAccoutSql () {
    return `INSERT INTO account (username,password,created_time,updated_time) VALUES (?,?,datetime('now','localtime'),datetime('now','localtime'))`;
}

/** 建立 sqlite 物件 */
var db = new sqlite3.Database(DB_SOURCE, err => {
    if (err) {
        console.error("Cannot open database: ", err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        // 建立 Account Table
        db.run(createAccoutTableSql(), err => {
            if (err) {
                console.error(`Table \'${ACCOUNT}\' already created`);
            }

            db.get(countAccountSql('username'), ["admin"], (err, res) => {
                if (err) {
                    console.error(`Checking account 'admin' failed`, err);
                    return;
                }
                // console.log("count: ", res.total);
                if (res.total === 0) {
                    db.run(insertAccoutSql(),
                        ["admin", "admin"],
                        (err, res) => {
                            if (err) {
                                console.error(`Creating account 'admin' failed`);
                                return;
                            }

                            console.log(`Account 'admin' is created`);
                        });
                }
            })
        });
        // 建立 Blog Table
        db.run(createBlogTableSql(), err => {
            if (err) {
                console.error(`Table \'${BLOG}\' already created`);
            }
        });
    }
});

module.exports = db;
