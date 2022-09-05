const qs = require("qs");
const ProductModel = require("../model/product-model");
const fs = require("fs");
const cookie = require("cookie");


class CartController {
    productModel;

    constructor() {
        this.productModel = new ProductModel();
    }

    addToCart(req, res) {
        let data = '';
        req.on('data', function (chunk) {
            data += chunk;
        })
        req.on('end', async () => {
            let dataBody = qs.parse(data);
            let idProduct = dataBody.idProduct;
            let product = await this.productModel.findProductById(idProduct);

            let cart = {
                items: [product[0]],
                totalMoney: product[0].price,
                totalQuantity: 1
            }



            if (req.headers.cookie) {
                let cookieReq = cookie.parse(req.headers.cookie);
                if (cookieReq) {
                    let cartCookie = cookieReq.cart;

                    let cartId = JSON.parse(cartCookie).cartId;

                    // file exitst
                    if (fs.existsSync('./session/cart/' + cartId + '.txt')) {

                        let dataCart = fs.readFileSync('./session/cart/' + cartId + '.txt', 'utf8');
                        cart = JSON.parse(dataCart);
                        cart.items.push(product[0]);
                        cart.totalMoney += product[0].price;
                        cart.totalQuantity += 1;

                        fs.writeFile('./session/cart/' + cartId + '.txt', JSON.stringify(cart), function (err) {
                            res.end(String(cart.totalQuantity));
                        })



                    } else {
                        let nameFile = Date.now();
                        fs.writeFile('./session/cart/' + nameFile + '.txt', JSON.stringify(cart), function (err) {
                            if (err) {
                                console.log(err.message);
                            }
                            let cartCookie = {
                                cartId: nameFile
                            }
                            let cookies = cookie.serialize('cart', JSON.stringify(cartCookie))
                            res.setHeader('set-cookie', cookies);
                            res.end();
                        })
                    }
                }
            } else {
                let nameFile = Date.now();
                fs.writeFile('./session/cart/' + nameFile + '.txt', JSON.stringify(cart), function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                    let cartCookie = {
                        cartId: nameFile
                    }
                    let cookies = cookie.serialize('cart', JSON.stringify(cartCookie))
                    res.setHeader('set-cookie', cookies);
                    res.end();
                })
            }
        })
    }
    deleteCart(req, res) {
        let data = '';
        req.on('data', function (chunk) {
            data += chunk;
        })
        req.on('end', async () => {
            let dataBody = qs.parse(data);
            let idProduct = dataBody.idProduct;
            let product = await this.productModel.findProductById(idProduct);
            // console.log(product.items);

            let cookieReq = cookie.parse(req.headers.cookie);
            console.log(cookieReq)
            let cartCookie = cookieReq.cart;
            // let cartId = JSON.parse(cartCookie).cartId;
            console.log(cartCookie)


    })
    }
}

module.exports = CartController;