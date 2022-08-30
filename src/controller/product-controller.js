const ProductModel = require('../model/product-model');
const fs = require('fs');
const qs = require('qs');
const url = require('url');


class ProductController {
    productModel;

    constructor() {
        this.productModel = new ProductModel();
    }

    showCreateProduct(req, res) {
        fs.readFile('./views/createProduct.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data);
            res.end();
        })
    }

    createProduct(req, res) {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', async () => {
            let product = qs.parse(data);
            await this.productModel.createNewProduct(product);
            res.writeHead(301, {'Location': '/product'})
            res.end();
        })
    }

    async showProduct(req, res) {
        let products = await this.productModel.getAllProducts();
        fs.readFile('./views/Products.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err.message);
            }
            let showHtml = '';
            products.forEach((product, index) => {
                showHtml += `<tr>`
                showHtml += `<td>${index + 1}</td>`
                showHtml += `<td>${product.productName}</td>`
                showHtml += `<td>${product.amount}</td>`
                showHtml += `<td>${product.price}</td>`
                showHtml += `<td>${product.detail}</td>`
                showHtml += `<td>${product.productCode}</td>`
                showHtml += `<td><a href="/deleteProduct?index=${product.productNumber}" class="btn btn-danger">Delete</a></td>`
                showHtml += `<td><a href="/updateProduct?index=${product.productNumber}">Update</a></td>`
                showHtml += `<tr>`
            });
            data = data.replace('{list-products}', showHtml)
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data)
            res.end();
        })
    }

    async searchProduct(req, res) {
        let keywordPro = qs.parse(url.parse(req.url).query).keywordPro;
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
                html += `<td><a href="/updateProduct?index=${product.productNumber}" class="btn-primary">Update</a></td>`
                html += `</tr>`
            })
        } else {
            html += "<tr>"
            html += `<td colspan="4" class="text-center">Không có dữ liệu</td>`;
            html += "</td>"
        }
        fs.readFile('./views/Products.html', 'utf-8', function (err, data) {
            if (err) {
                throw new Error(err.message);
            }
            data = data.replace('{list-products}', html);
            data = data.replace(' <input type="text" name="keywordPro" placeholder="Enter your name" class="form-control">', `<input type="text" name="keywordPro" value="${keywordPro}" placeholder="Enter your name" class="form-control">`)
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    async deleteProduct(req, res) {
        let index = qs.parse(url.parse(req.url).query).index;
        await this.productModel.deleteProduct(index);
        res.writeHead(301, {'location': '/product'});
        res.end();
    }
    showFormUpdate(req, res) {
        fs.readFile('./views/updateProduct.html','utf8', function(err, data) {
            if (err) {
                console.log(err.message);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    editProduct(req, res) {
        let index = qs.parse(url.parse(req.url).query).index;
        let data ='';
        req.on('data', chunk => data += chunk)
        req.on('end', async() => {
            let product = qs.parse(data)
            await this.productModel.updateProduct(product, index);
            res.writeHead(301, {'Location': '/product'});
            res.end();
        })
    }
}

module.exports = ProductController;