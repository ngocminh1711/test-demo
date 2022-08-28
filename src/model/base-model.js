const DBconnect = require("./DBconnect");

class BaseModel {
    conn;


    constructor() {
        let db = new DBconnect();
        this.conn = db.connect();
    }

    querySQL(sql) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

}

module.exports = BaseModel;