const BaseModel = require('../model/base-Model');


class ProductModel extends BaseModel {

    async createNewProduct(data) {
        const sql = `INSERT INTO products (casestudy.products.productName, amount, price, detail, casestudy.products.productCode) VALUES ('${data.newNamePro}', '${data.newAmount}', '${data.newPrice}', '${data.newDetail}','${data.newProductCode}');`
        return await this.querySQL(sql);

    }


    async getAllProducts() {
        const sql = `SELECT * FROM products`;
        return await this.querySQL(sql);
    }
    async getWomenShirt(){
        const sql = `SELECT * FROM products WHERE productCode LIKE '%ANU%'`;
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
    async updateProduct(data,index) {
        const sql = `UPDATE products
                     SET productName = '${data.nameProUpdate}',amount = '${data.amountProUpdate}',price = '${data.priceProUpdate}', detail = '${data.detailProUpdate}',productCode = '${data.productCodeProUpdate}'
                     WHERE productNumber = '${index}';`
        return await this.querySQL(sql);
    }

    async getMenShirtProducts() {
        const sql = `SELECT *
                     FROM products
                     WHERE productCode like '%ANA%'`;
        return await this.querySQL(sql);
    }
    async getMenPantsProducts() {
        const sql = `SELECT *
                     FROM products
                     WHERE productCode like '%QNA%'`;
        return await this.querySQL(sql);
    }
    async getWomenPantsProducts(){
        const sql = `SELECT *
                     FROM products
                     WHERE productCode like '%QNU%'`;
        return await this.querySQL(sql);
    }
    async getWomenShirtProducts(){
        const sql = `SELECT *
                     FROM products
                     WHERE productCode like '%ANU%'`;
        return await this.querySQL(sql);
    }

}
module.exports = ProductModel;

