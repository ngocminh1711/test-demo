const http = require('http');
const fs = require('fs');
const PORT = 8000;
const url = require('url');
const Controller = require('./src/controller/user-controller')
const ProductController = require('./src/controller/product-controller')
const CartController = require("./src/controller/cart-controller");


// khởi tạo đối tượng Controller
let productController = new ProductController();
let controller = new Controller();
let cartController = new CartController();
let mimeTypes = {
    'jpg': 'images/jpg',
    'png': 'images/png',
    'gid': 'images/gid',
    'js': 'text/javascript',
    'css': 'text/css',
    'svg': 'image/svg+xml',
    'ttf': 'font/ttf',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'eot': 'application/vnd.ms-fontobject'
}

const server = http.createServer((req, res) => {
    // lấy pathName
    let urlPath = url.parse(req.url).pathname;

    // lấy tên đuôi file sau chấm để truy vấn đến các js,css,img
    const fileDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/)

    if (fileDefences) {
        const extension = mimeTypes[fileDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname + req.url).pipe(res);
    } else {
        switch (urlPath) {
            case '/':
                if (req.method === 'GET') {
                    controller.showFormLogin(req, res);
                } else {
                    controller.login(req, res);
                }

                break;
            case '/signup':
                if (req.method === 'GET') {
                    controller.showSignUp(req, res);
                } else {
                    controller.createUser(req, res);
                }

                break;
            case '/admin':
                controller.showAdmin(req, res).catch(function (error) {
                    throw new Error(error.message);
                });
                break;
            case '/deleteUser':
                controller.deleteUser(req, res).catch(function (error) {
                    throw new Error(error.message);
                })
                break;
            case '/admin/search':
                controller.searchUser(req, res).catch(function (error) {
                    throw new Error(error.message);
                })
                break;

            case '/product':
                productController.showProduct(req, res).catch(function (error) {
                    throw new Error(error.message);
                })
                break;
            case '/product/search':

                productController.searchProduct(req, res).catch(function (error) {
                    throw new Error(error.message);
                })
                break;
            case '/deleteProduct':
                productController.deleteProduct(req, res).catch(function (error) {
                    throw new Error(error.message);
                })
                break;

            case '/updateUser':
                if (req.method === 'GET') {
                    controller.showFormUpdate(req, res);
                } else {
                    controller.updateUser(req, res);
                }
                break;
            case '/homepage':
                controller.showHomePage(req, res);
                break;

            case '/updateProduct':
                if (req.method === 'GET') {
                    productController.showFormUpdate(req, res);
                } else {
                    productController.editProduct(req, res);
                }
                break;
            case '/createProduct':
                if (req.method === 'GET') {
                    productController.showCreateProduct(req, res);
                } else {
                    productController.createProduct(req, res);
                }
                break;
            case '/aonu':
                productController.showWomenShirt(req, res).catch(function (err) {
                    throw new Error(err.message);
                });
                break;
            case '/pageAoNam':
                productController.showMenShirt(req, res).catch(function (err) {
                    throw new Error(err.message);
                });
                break;
            case '/pageQuanNam':
                productController.showMenPants(req, res).catch(function (err) {
                    throw new Error(err.message);
                })
                break;
                case '/pageQuanNu':
                    productController.showWomenPants(req, res).catch(function (err) {
                        throw new Error(err.message);
                    })
                break;
            case '/add-to-cart':
                cartController.addToCart(req, res)
                break;
            case '/confirm-order':
                productController.confirmOrder(req, res)
                break;
            case '/delete-cart':
                cartController.deleteCart(req, res)
                break;
            default:
                res.end();
        }
    }
})
server.listen(PORT, () => {
    console.log(` http://localhost:${PORT}/homepage`);
});