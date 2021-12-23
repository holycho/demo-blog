var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite"
const BLOG = "blog";
const ACCOUNT = "account";

let db = new sqlite3.Database(DBSOURCE, err => {
    if (err) {
        console.error("Cannot open database: ", err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE ${ACCOUNT} (
            acc_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NUT NULL,
            password TEXT NOT NULL,
            created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`, err => {
            if (err) {
                console.error(`Table \'${ACCOUNT}\' already created`);
            }

            db.get(`SELECT COUNT(*) as total FROM account WHERE username=?`, ["admin"], (err, res) => {
                if (err) {
                    console.error(`Checking account 'admin' failed`, err);
                    return;
                }
                // console.log("count: ", res.total);
                if (res.total === 0) {
                    db.run(`INSERT INTO account (username,password,created_time,updated_time) VALUES (?,?,datetime('now','localtime'),datetime('now','localtime'))`,
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

        db.run(`CREATE TABLE ${BLOG} (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title TEXT,
            content TEXT,
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES account(acc_id) ON UPDATE CASCADE
        )`, err => {
            if (err) {
                console.error(`Table \'${BLOG}\' already created`);
            }
        });
    }
});

module.exports = db;