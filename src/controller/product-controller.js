const ProductModel = require('../model/product-model');
const fs = require('fs');
const qs = require('qs');
const url = require('url');


class ProductController {
    productModel;

    constructor() {
        this.productModel = new ProductModel();
    }

    async showProduct(req, res) {
        let products = await this.productModel.getAllProducts();
        fs.readFile('./views/Products.html', 'utf-8',  function (err, data) {
            if (err) {
                console.log(err.message);
            }
            let html = '';
            products.forEach((product, index) => {
                html += `<tr>`
                html += `<td>${index + 1}</td>`
                html += `<td>${product.productName}</td>`
                html += `<td>${product.amount}</td>`
                html += `<td>${product.price}</td>`
                html += `<td>${product.detail}</td>`
                html += `<td>${product.productCode}</td>`
                html += `<td><a href="/deleteProduct?index=${product.productNumber}" class="btn btn-danger">Delete</a></td>`
                html += `<tr>`
            })
            data = data.replace('{list-products}', html)
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data)
            res.end();
        })
    }

    async searchProduct(req, res) {
        let keywordPro = qs.parse(url.parse(req.url).query).keywordPro;
        console.log(keywordPro);
        let products = await this.productModel.searchProductByName(keywordPro);

        let html = '';
        if (products.length > 0) {
            products.forEach((product, index) => {
                html += `<tr>`
                html += `<td>${index + 1}</td>`
                html += `<td>${product.productName}</td>`
                html += `<td>${product.amount}</td>`
                html += `<td>${product.price}</td>`
                html += `<td>${product.detail}</td>`
                html += `<td>${product.productCode}</td>`
                html += `<td><a href="/deleteProduct?index=${product.productNumber}" class="btn btn-danger">Delete</a></td>`
                html += `</tr>`
            })
        }
        else {
            html += "<tr>"
            html += `<td colspan="4" class="text-center">Không có dữ liệu</td>`;
            html += "</td>"
        }
        fs.readFile('./views/Products.html', 'utf-8', function(err, data) {
            if (err) {
                throw new Error(err.message);
            }
            data = data.replace('{list-products}', html);
            data = data.replace(' <input type="text" name="keywordPro" placeholder="Enter your name" class="form-control">', `<input type="text" name="keywordPro" value="${keywordPro}" placeholder="Enter your name" class="form-control">`)
            res.writeHead(200,{'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    async deleteProduct(req, res) {
        let index = qs.parse(url.parse(req.url).query).index;
        await this.productModel.deleteProduct(index);
        res.writeHead(301,{'location': '/product'});
        res.end();
    }


}

module.exports = ProductController;