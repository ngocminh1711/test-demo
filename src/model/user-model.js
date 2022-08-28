const DBconnect = require('./DBconnect')

class UserModel {
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

    async createNewUser(id, password) {
        const sql = `INSERT INTO users (userName, password)
                     VALUES ('${id}', '${password}');`
        return await this.querySQL(sql);
    }
    async getAllUser() {
        const sql = `SELECT * FROM users`;
        return await this.querySQL(sql);
    }
    async deleteUser(index) {
        const sql = `DELETE FROM users WHERE id = ${index}`;
        return await this.querySQL(sql);
    }
}

module.exports = UserModel;