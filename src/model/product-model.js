const BaseModel = require('../model/base-Model');

class ProductModel extends BaseModel {
    async createNewProduct(productNumber, productName, amount, price, detail, productCode) {
        const sql = `INSERT INTO products (productName, amount, price, detail, productCode)
                     VALUES ('${productNumber}', '${productName}', '${amount}', '${price}', '${detail}'),'${productCode}';`
        return await this.querySQL(sql);

    }

    async getAllProducts() {
        const sql = `SELECT *
                     FROM products`;
        return await this.querySQL(sql);
    }
    async searchProductByName(keywordPro) {
        const sql = `SELECT *
                     FROM products
                     WHERE productName like '%${keywordPro}%'`;
        return await this.querySQL(sql);
    }
    async deleteProduct(index){
        const sql = `DELETE FROM products
                     WHERE productNumber = '${index}'`;
        return await this.querySQL(sql);
    }

}
module.exports = ProductModel;

