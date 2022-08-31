const ProductModel = require('../model/product-model');
const fs = require('fs');
const qs = require('qs');
const url = require('url');
const cookie = require("cookie");


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
                showHtml += `<td><a href="/updateProduct?index=${product.productNumber}" class="btn btn-primary">Update</a></td>`
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
        fs.readFile('./views/updateProduct.html', 'utf8', function (err, data) {
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
        let data = '';
        req.on('data', chunk => data += chunk)
        req.on('end', async () => {
            let product = qs.parse(data)
            await this.productModel.updateProduct(product, index);
            res.writeHead(301, {'Location': '/product'});
            res.end();
        })
    }

    async showMenShirt(req, res){
        let products = await this.productModel.getMenShirtProducts();
        let html = '';
        products.forEach((item, index) => {
            html += `<li class="list-group-item">
                          <div class="media align-items-lg-center flex-column flex-lg-row p-3">
                            <div class="media-body order-2 order-lg-1">
                            <h5 class="mt-0 font-weight-bold mb-2">${item.productName}</h5>
                            <p class="font-italic text-muted mb-0 small"> ${item.detail}</p>
                            <div class="d-flex align-items-center justify-content-between mt-1">
                                <h6 class="font-weight-bold my-2">$ ${item.price}</h6>
                                <ul class="list-inline small">
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                </ul>
                                <button onclick="addToCart(${item.productNumber})" type="button" class="btn bg-cart"><i class="fa fa-cart-plus mr-2"></i> Add to cart</button>
                            </div>
                        </div>
                        <img src="${item.img}" alt="Generic placeholder image" width="200" class="ml-lg-5 order-1 order-lg-2">
                        </div>
                       </li>`;
        });
        let cartTotalQuantity = 0;
        if(req.headers.cookie){
            let cookieReq = cookie.parse(req.headers.cookie);
            let cartCookie = cookieReq.cart;
            let cartId = JSON.parse(cartCookie).cartId;
            if (fs.existsSync('./session/cart/' + cartId + '.txt')) {
                let dataCart = fs.readFileSync('./session/cart/' + cartId +'.txt','utf-8');
                let cart = JSON.parse(dataCart);
                cartTotalQuantity = cart.totalQuantity;
            }
        }

        fs.readFile('./views/pageAoNam.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err.message);
            }
            data = data.replace('{total-product-cart}', String(cartTotalQuantity));
            data = data.replace('{list-menShirt}', html);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })

    }
    async showMenPants(req, res){
        let products = await this.productModel.getMenPantsProducts();
        let html = '';
        products.forEach((item, index) => {
            html += `<li class="list-group-item">
                          <div class="media align-items-lg-center flex-column flex-lg-row p-3">
                            <div class="media-body order-2 order-lg-1">
                            <h5 class="mt-0 font-weight-bold mb-2">${item.productName}</h5>
                            <p class="font-italic text-muted mb-0 small"> ${item.detail}</p>
                            <div class="d-flex align-items-center justify-content-between mt-1">
                                <h6 class="font-weight-bold my-2">$ ${item.price}</h6>
                                <ul class="list-inline small">
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                </ul>
                                <button onclick="addToCart(${item.productNumber})" type="button" class="btn bg-cart"><i class="fa fa-cart-plus mr-2"></i> Add to cart</button>
                            </div>
                        </div>
                        <img src="${item.img}" alt="Generic placeholder image" width="200" class="ml-lg-5 order-1 order-lg-2">
                        </div>
                       </li>`;
        });
        let cartTotalQuantity = 0;
        if(req.headers.cookie){
            let cookieReq = cookie.parse(req.headers.cookie);
            let cartCookie = cookieReq.cart;
            let cartId = JSON.parse(cartCookie).cartId;
            if (fs.existsSync('./session/cart/' + cartId + '.txt')) {
                let dataCart = fs.readFileSync('./session/cart/' + cartId +'.txt','utf-8');
                let cart = JSON.parse(dataCart);
                cartTotalQuantity = cart.totalQuantity;
            }
        }

        fs.readFile('./views/pageQuanNam.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err.message);
            }
            data = data.replace('{total-product-cart}', String(cartTotalQuantity));
            data = data.replace('{list-menPants}', html);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })

    }
    async showWomenPants(req, res) {
        let products = await this.productModel.getWomenPantsProducts();
        let html = '';
        products.forEach((item, index) => {
            html += `<li class="list-group-item">
                          <div class="media align-items-lg-center flex-column flex-lg-row p-3">
                            <div class="media-body order-2 order-lg-1">
                            <h5 class="mt-0 font-weight-bold mb-2">${item.productName}</h5>
                            <p class="font-italic text-muted mb-0 small"> ${item.detail}</p>
                            <div class="d-flex align-items-center justify-content-between mt-1">
                                <h6 class="font-weight-bold my-2">$ ${item.price}</h6>
                                <ul class="list-inline small">
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                </ul>
                                <button onclick="addToCart(${item.productNumber})" type="button" class="btn bg-cart"><i class="fa fa-cart-plus mr-2"></i> Add to cart</button>
                            </div>
                        </div>
                        <img src="${item.img}" alt="Generic placeholder image" width="200" class="ml-lg-5 order-1 order-lg-2">
                        </div>
                       </li>`;
        });
        let cartTotalQuantity = 0;
        if(req.headers.cookie){
            let cookieReq = cookie.parse(req.headers.cookie);
            let cartCookie = cookieReq.cart;
            let cartId = JSON.parse(cartCookie).cartId;
            if (fs.existsSync('./session/cart/' + cartId + '.txt')) {
                let dataCart = fs.readFileSync('./session/cart/' + cartId +'.txt','utf-8');
                let cart = JSON.parse(dataCart);
                cartTotalQuantity = cart.totalQuantity;
            }
        }

        fs.readFile('./views/pageQuanNu.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err.message);
            }
            data = data.replace('{total-product-cart}', String(cartTotalQuantity));
            data = data.replace('{list-womenPants}', html);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    async showWomenShirt(req, res) {
        let products = await this.productModel.getWomenShirtProducts();
        let html = '';
        products.forEach((item, index) => {
            html += `<li class="list-group-item">
                          <div class="media align-items-lg-center flex-column flex-lg-row p-3">
                            <div class="media-body order-2 order-lg-1">
                            <h5 class="mt-0 font-weight-bold mb-2">${item.productName}</h5>
                            <p class="font-italic text-muted mb-0 small"> ${item.detail}</p>
                            <div class="d-flex align-items-center justify-content-between mt-1">
                                <h6 class="font-weight-bold my-2">$ ${item.price}</h6>
                                <ul class="list-inline small">
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                    <li class="list-inline-item m-0"><i class="fa fa-star text-success"></i></li>
                                </ul>
                                <button onclick="addToCart(${item.productNumber})" type="button" class="btn bg-cart"><i class="fa fa-cart-plus mr-2"></i> Add to cart</button>
                            </div>
                        </div>
                        <img src="${item.img}" alt="Generic placeholder image" width="200" class="ml-lg-5 order-1 order-lg-2">
                        </div>
                       </li>`;
        });
        let cartTotalQuantity = 0;
        if(req.headers.cookie){
            let cookieReq = cookie.parse(req.headers.cookie);
            let cartCookie = cookieReq.cart;
            let cartId = JSON.parse(cartCookie).cartId;
            if (fs.existsSync('./session/cart/' + cartId + '.txt')) {
                let dataCart = fs.readFileSync('./session/cart/' + cartId +'.txt','utf-8');
                let cart = JSON.parse(dataCart);
                cartTotalQuantity = cart.totalQuantity;
            }
        }

        fs.readFile('./views/aonu.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err.message);
            }
            data = data.replace('{total-product-cart}', String(cartTotalQuantity));
            data = data.replace('{list-womens-shirt}', html);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
}

module.exports = ProductController;