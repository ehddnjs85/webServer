module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const conn = require('../../../config/db.config.js')();
    const dbconn = conn.init(); 
    let secretObj = require("../../../config/jwt");
    var pbkdf2Password = require('pbkdf2-password');
    var hasher = pbkdf2Password();

    // GET Login page.
    router.get('/', function(req, res) {
        res.clearCookie("user");
        res.render("login/login");
    });
    // GET Logout
    router.get('/logout', function (req, res) {
        res.clearCookie("user");
        res.render("login/login");
    });

    // POST Login 
    router.post('/', function(req, res, next) {

        uname = req.body.username;
        pwd = req.body.password;

        let sql = 'SELECT * FROM user';
        dbconn.query(sql, function (err, rows) {
            for (var i = 0; i < rows.length; i++){
                if (rows[i].username === uname) {
                    var u_p = rows[i];
                    //입력된 패스워드와 DB에 저장된 salt를 합쳐 hash 생성
                    hasher({password:pwd, salt:u_p.salt}, function(err, pass, salt, hash) {
                        if(hash === u_p.password) { //입력한 hash(password)와 DB에 있는 password와 같은지 비교
                            res.cookie("user", secretObj);
                            res.send(rows)
                        } else {
                            console.log("error : " , err)
                            res.send(err)
                        }
                    });
                }
            }
        });
    });
    return router;
};