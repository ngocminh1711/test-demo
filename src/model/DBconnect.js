const mysql = require('mysql');

class  DBconnect {
    host;
    port;
    user;
    database;
    password;

    constructor() {
        this.host = 'localhost';
        this.port = 3306;
        this.user = 'root';
        this.database = 'casestudy';
        this.password = '123456'
    }

    connect() {
        return mysql.createConnection({
            host: this.host,
            port: this.port,
            user: this.user,
            database: this.database,
            password: this.password
        })
    }
}

module.exports = DBconnect;