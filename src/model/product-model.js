const BaseModel = require("./base-model");

class ProductModel extends BaseModel {

    async getInfoProducts() {
        const sql = `SELECT * FROM products`
        return await this.querySQL(sql)
    }

}
module.exports = ProductModel;