const fs = require('fs');
const UserModel = require("../model/user-model");
const qs = require('qs');
const url = require("url");

class UserController {
    userModel;

    constructor() {
        this.userModel = new UserModel();
    }

    async showAdmin(req, res) {
        let users = await this.userModel.getAllUser();
        console.log(users)
        fs.readFile('./views/admin.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err.message);
            }
            let html = '';
            users.forEach((user, index) => {
                html += `<tr>`
                html += `<td>${index + 1}</td>`
                html += `<td>${user.userName}</td>`
                html += `<td>${user.password}</td>`
                html += `<td><a href="/deleteUser?index=${user.id}" class="btn btn-danger">Delete</a></td>`
                html += `<tr>`
            })
            data = data.replace('{list-users}', html)
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(data);
            res.end()
        })
    }

    async showLogin(req, res) {
        fs.readFile('./views/index.html', 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    showSignUp(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/sign-up.html', 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            })
        }
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', async () => {
                let user = qs.parse(data);
                // console.log(user);
                let username = user.id;
                let password = user.password;
                await this.userModel.createNewUser(username, password);
                res.writeHead(301, {'Location': '/admin'})
                res.end();
            }
        );
    }

   async deleteUser(req, res) {
        let index = qs.parse(url.parse(req.url).query).index;
        // console.log(index);
        await this.userModel.deleteUser(index);
        res.writeHead(301, {'Location': '/admin'});
        res.end();
    }
}

module.exports = UserController;