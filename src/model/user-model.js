const BaseModel = require("./base-model");

class UserModel extends BaseModel {


    async createNewUser(username, password, fullname, email, phone, city, state) {
        const sql = `INSERT INTO users (username, password, fullname, email, phone, city, state)
                     VALUES ('${username}', '${password}', '${fullname}', '${email}', '${phone}', '${city}', '${state}
                             ');`
        return await this.querySQL(sql);
    }

    async getAllUser() {
        const sql = `SELECT *
                     FROM users`;
        return await this.querySQL(sql);
    }
    async CheckUser(data) {
       const sql = `SELECT * FROM users WHERE userName = '${data.username}' AND password = '${data.password}'`;
        return await this.querySQL(sql);
    }

    async deleteUser(index) {
        const sql = `DELETE
                     FROM users
                     WHERE id = ${index}`;
        return await this.querySQL(sql);
    }

    async searchUserByName(keyword) {
        const sql = `SELECT *
                     FROM users
                     WHERE userName LIKE '%${keyword}%'`;
        return await this.querySQL(sql);
    }

    async editUser(data, index) {
        const sql = `UPDATE users
                     SET userName = '${data.usernameUpdate}',
                         password = '${data.passwordUpdate}',
                         fullname = '${data.nameUpdate}',
                         email    = '${data.emailUpdate}',
                         phone    = '${data.phoneUpdate}',
                         city     = '${data.cityUpdate}',
                         state    = '${data.stateUpdate}'
                     WHERE id = '${index}'`;
        return await this.querySQL(sql);
    }
}

module.exports = UserModel;