const http = require('http');
const fs = require('fs');
const PORT = 8000;
const url = require('url');
const Controller = require('./src/controller/user-controller')


// khởi tạo đối tượng Controller
let controller = new Controller();
let mimeTypes={
    'jpg' : 'images/jpg',
    'png' : 'images/png',
    'js' :'text/javascript',
    'css' : 'text/css',
    'svg':'image/svg+xml',
    'ttf':'font/ttf',
    'woff':'font/woff',
    'woff2':'font/woff2',
    'eot':'application/vnd.ms-fontobject'
}

const server = http.createServer((req, res) => {
    // lấy pathName
    let urlPath = url.parse(req.url).pathname;
    // console.log(urlPath);
    // lấy tên đuôi file sau chấm để truy vấn đến các js,css,img
    const fileDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/)

    if (fileDefences) {
        const extension = mimeTypes[fileDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname + req.url).pipe(res);
        // console.log(extension);
    }
    else {
        switch (urlPath) {
            case '/':
                if (req.method === 'GET') {
                    controller.showFormLogin(req, res);
                }
                else {
                    controller.login(req, res);
                }
                break;
            case '/signup':
                if (req.method === 'GET') {
                    controller.showSignUp(req, res);
                }
                else {
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
            case '/updateUser':
                if (req.method === 'GET') {
                    controller.showFormUpdate(req, res);
                }
                else {
                    controller.updateUser(req, res);
                }
                break;
            default:
                res.end();
        }
    }

})
server.listen(PORT,  () => {
    console.log(` http://localhost:${PORT}`);
})