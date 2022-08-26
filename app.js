const http = require('http');
const fs = require('fs');
const PORT = 8000;
const url = require('url');
const Controller = require('./src/controller/Controller')


// khởi tạo đối tượng Controller
let controller = new Controller();


const server = http.createServer((req, res) => {
    // lấy pathName
    let urlPath = url.parse(req.url).pathname;
    // console.log(urlPath);
    // lấy tên đuôi file sau chấm để truy vấn đến các js,css,img
    let extension = urlPath.split('.').pop();
    let img = ['png','gif','psd','pdf','jpg','jpeg'];
    let arrExtensions = ['js', 'css', 'jpg'];

    if (arrExtensions.indexOf(extension) !== -1 ) {
        switch (extension) {
            case 'css':
                // console.log(extension);
                fs.readFile('./public/css/style.css', 'utf8', function(err,data) {
                    if (err) {
                        throw new Error(err.message);
                    }
                    res.writeHead(200, {'Content-Type': 'text/css'});
                    res.write(data);
                    res.end();
                })
                break;
            case 'jpg':
                // console.log(img)
                fs.readFile('./images/bg.jpg', function(err,data) {
                    if (err) {
                        console.log(err.message);
                    }
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.write(data);
                    res.end();
                })
                break;
            case 'js':
                fs.readFile('./public/js/main.js','utf8', function(err, data) {
                    if (err) {
                        throw new Error(err.message);
                    }
                    res.writeHead(200, {'Content-Type': 'text/javascript'});
                    res.write(data);
                    res.end();
                })
                break;
            default:
                res.end();
        }
    }
    else {
        switch (urlPath) {
            case '/':
                controller.showLogin(req, res);
                break;
            case '/signup':
                console.log(1)
                controller.showSignUp(req, res);
                break;
            default:
                res.end();
        }
    }

})
server.listen(PORT,  () => {
    console.log(` http://localhost:${PORT}`);
})