module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const conn = require('../../../config/db.config.js')();
    const dbconn = conn.init(); 
    let jwt = require("jsonwebtoken");
    let secretObj = require("../../../config/jwt");
    var pbkdf2Password = require('pbkdf2-password');
    var hasher = pbkdf2Password();

    // GET Login page.
    router.get('/', function(req, res) {
        res.clearCookie("user");
        res.render("login/login");
    });
    
    // POST Login 
    router.post('/login', function(req, res, next) {

        var token = jwt.sign ({test : '1111'},secretObj.secret,
        {
            subject : "jwtToken",
            expiresIn : "10",
            issuer : "pang"
        });


        hasher({password:req.body.password}, function(err, pass, salt, hash) {
            username = req.body.username;
            password = hash;
            let sql = 'SELECT username, password FROM user';
            dbconn.query(sql, function (err, rows) {
                for (var i = 0; i < rows.length; i++){
                    if (rows[i].username === req.body.username && hash === password) {
                        res.cookie("user", token);
                        res.render("index");
                        return true;
                    } 
                }
            })
        });
    });

    return router;
};