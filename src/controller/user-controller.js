const fs = require('fs');
const UserModel = require("../model/user-model");
const qs = require('qs');
const url = require("url");
const cookie = require('cookie');
const {serialize} = require("cookie");
const ProductModel = require("../model/product-model");

class UserController {
    userModel;
    productModel;
    constructor() {
        this.userModel = new UserModel();
        this.productModel = new ProductModel();
    }

    async showAdmin(req, res) {
        let dataUsers = await this.userModel.getAllUser();

        fs.readFile('./views/admin.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err.message);
            }
            let html = '';
            dataUsers.forEach((user, index) => {
                html += `<tr>`
                html += `<td>${index + 1}</td>`;
                html += `<td>${user.userName}</td>`;
                html += `<td>${user.password}</td>`;
                html += `<td>${user.fullname}</td>`;
                html += `<td>${user.email}</td>`;
                html += `<td>${user.phone}</td>`;
                html += `<td>${user.city}</td>`;
                html += `<td>${user.state}</td>`;
                html += `<td><a href="/deleteUser?index=${user.id}" class="btn btn-danger">Delete</a></td>`;
                html += `<td><a href="/updateUser?index=${user.id}" class="btn btn-primary">Update</a></td>`;
                html += `<tr>`
            })

            data = data.replace('{list-users}', html)
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data);
            res.end()
        })
    }

    showFormLogin(req, res) {
        // get cookie from  header request
        //     let cookies = cookie.parse(req.headers.cookie);
        //     console.log(cookies);
        // let cookieUserLogin = cookies.user;
        //     // console.log(cookieUserLogin)

        fs.readFile('./views/index.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    login(req, res) {
        let data = '';
        req.on('data', chunk => data += chunk)
        req.on('end', async () => {
            let users = qs.parse(data);
            console.log(users)
            let userDB = await this.userModel.CheckUser(users);
            console.log(userDB)

            // // tạo cookie cho đăng nhập
            // const setCookie = serialize('user', JSON.stringify(users))
            // console.log(setCookie)
            // // gửi cookie tới server
            // res.setHeader('Set-Cookie', setCookie);

            // Đăng nhập:
            if (userDB.length > 0 && userDB[0].role == 0) {
                res.writeHead(301, {'Location': '/admin'});
                return res.end();
            } else {
                res.writeHead(301, {'Location': '/homepage'});
                return res.end();
            }
        })
    }

    showSignUp(req, res) {
        fs.readFile('./views/sign-up.html', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    createUser(req, res) {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', async () => {
            let user = qs.parse(data);
            let username = user.username;
            let password = user.password;
            let fullname = user.fullname;
            let email = user.email;
            let phone = user.phone;
            let city = user.city;
            let state = user.state;
            await this.userModel.createNewUser(username, password, fullname, email, phone, city, state);
            res.writeHead(301, {'Location': '/'})
            res.end();
        });
    }

    async deleteUser(req, res) {
        let index = qs.parse(url.parse(req.url).query).index;

        await this.userModel.deleteUser(index);
        res.writeHead(301, {'Location': '/admin'});
        res.end();
    }

    async searchUser(req, res) {
        let keyword = qs.parse(url.parse(req.url).query).keyword;
        let users = await this.userModel.searchUserByName(keyword);

        let html = '';
        if (users.length > 0) {
            users.forEach((user, index) => {
                html += `<tr>`
                html += `<td>${index + 1}</td>`;
                html += `<td>${user.userName}</td>`;
                html += `<td>${user.password}</td>`;
                html += `<td>${user.fullname}</td>`;
                html += `<td>${user.email}</td>`;
                html += `<td>${user.phone}</td>`;
                html += `<td>${user.city}</td>`;
                html += `<td>${user.state}</td>`;
                html += `<td><a href="/deleteUser?index=${user.id}" class="btn btn-danger">Delete</a></td>`;
                html += `<td><a href="/updateUser?index=${user.id}" class="btn btn-primary">Update</a></td>`;
                html += `<tr>`
            })
        } else {
            html += "<tr>";
            html += `<td colspan="4" class="text-center">Không có dữ liệu</td>`;
            html += "</tr>";
        }
        fs.readFile('./views/admin.html', 'utf-8', function (err, data) {
            if (err) {
                throw new Error(err.message)
            }
            data = data.replace('{list-users}', html);
            data = data.replace(' <input type="text" name="keyword" placeholder="Enter your name" class="form-control">', `<input type="text" name="keyword" value="${keyword}" placeholder="Enter your name" class="form-control">`)
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    showFormUpdate (req, res) {
        fs.readFile('./views/updateUser.html','utf-8', function(err, data) {
            if (err) {
                throw new Error(err.message);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    updateUser(req, res) {
        let index = qs.parse(url.parse(req.url).query).index;
        let data = '';
        req.on('data', function(chunk) {
            data += chunk;
        })
        req.on('end',async() => {
            let user = qs.parse(data);
            console.log(user);
            await this.userModel.editUser(user,index);
            res.writeHead(301,{'Location': '/admin'});
            res.end();
        })
    }
    async showHomePage(req, res){
        fs.readFile('./views/home-page.html','utf-8',function(err,data){
            if (err) {
                console.log(err.message);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

}

module.exports = UserController;