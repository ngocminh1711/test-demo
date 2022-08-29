
const BaseModel = require("./base-model");

class UserModel extends BaseModel {


    async createNewUser(username, password) {
        const sql = `INSERT INTO users (userName, password)
                     VALUES ('${username}', '${password}');`
        return await this.querySQL(sql);
    }
    async getAllUser() {
        const sql = `SELECT * FROM users`;
        return await this.querySQL(sql);
    }

    async CheckUser(data) {
       const sql = `SELECT * FROM users WHERE userName = '${data.userName}' AND password = '${data.password}'`;

   
        return await this.querySQL(sql);
    }
    async deleteUser(index) {
        const sql = `DELETE FROM users WHERE id = ${index}`;
        return await this.querySQL(sql);
    }
    async searchUserByName(keyword){
        const sql = `SELECT userName, password FROM users WHERE userName LIKE '%${keyword}%'`;
        return await this.querySQL(sql);
    }
    async updateUser(data,index) {
        const sql = `UPDATE users SET userName = '${data.username}', password = '${data.password}' WHERE id = ${index} `;
        return await this.querySQL(sql);
    }
}

module.exports = UserModel;