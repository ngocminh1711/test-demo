const fs = require('fs');

class Controller {

    showLogin (req, res) {
        fs.readFile('./views/index.html','utf-8' ,function(err, data) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    showSignUp(req, res) {
       fs.readFile('./view-sign-up/index.html','utf8', function(err, data) {
           if (err) {
               console.log(err);
           }
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.write(data);
           res.end();

       })
    }

}

module.exports = Controller;