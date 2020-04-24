module.exports = function() {
    const express = require('express');
    const router = express.Router();
    const conn = require('../../config/db.config.js')();
    const dbconn = conn.init();    
    var pbkdf2Password = require('pbkdf2-password');
    var hasher = pbkdf2Password();

    //Main
    router.get("/", function (req, res) {
        res.render('index');
    });

    //User List
    router.get("/user", function (req, res) {
        let sql = 'SELECT * FROM user';
        dbconn.query(sql, function(err, rows) {
            if(err) {
                console.log(err);
            } else {
                res.render("user/index", {rows});
            }
        })
    });
    
    router.post("/user", function (req, res) {
        let sql = 'SELECT * FROM user';
        dbconn.query(sql, function(err, rows) {
            if(err) {
                console.log(err);
            } else {
                res.send({rows});
            }
        })
    });

    // Create
    router.get("/user/account", function (req, res) {
        res.render("user/account", {rows : ""} );
    });
    
    router.post("/user/account", function (req, res) {
        hasher({password:req.body.password}, function(err, pass, salt, hash) { //생성할때 패스워드를 hash로 바꿈

            var user = {
                id : Math.random().toString(36).substr(2,9), //36자리 문자 코드 (a-z, 0~9)중 랜덤으로 뽑고 Math.random은 0.xxxx로 시작하므로 2번째부터 9번째 까지 출력
                username : req.body.username,
                email : req.body.email,
                password : hash,
                salt : salt,
                role : req.body.role
            }

            let sql = "INSERT INTO user SET ?";
            dbconn.query(sql, user, function (err, rows) {
                if(err) {
                    res.status(500).send('Internal Server Error');
                    console.log("err : " , err)
                } else {
                    res.send(rows);
                }
            });
        });        
    });

    // Edit
    router.get("/user/account/:id", function (req, res) {
        let id = req.params.id;
        let sql = 'SELECT * FROM user WHERE id = ?'
        dbconn.query(sql, id, function ( err, data) {
            let rows = data[0];
            res.render("user/account", {rows});
        });
    });

    router.put("/user/account/:id", function (req, res) {
        let id = req.params.id;
        hasher({password:req.body.password}, function(err, pass, salt, hash) { //생성할때 패스워드를 hash로 바꿈
        
            let data = {
                username : req.body.username,
                email : req.body.email,
                password : hash,
                salt : salt
            };

            let sql = 'UPDATE user SET ? WHERE id = ?';

            dbconn.query(sql, [data, id], function (err, rows) {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send(rows);
                }
            });
        });
    })

    // Delete
    router.delete('/user/delete/:id', function (req, res) {
        let id = req.params.id;
        let sql = 'DELETE FROM user WHERE id = ?'

        dbconn.query(sql, id, function (err, rows) { 
            if (err) {
                res.status(500).send('Internal Server Error');
            } else {
                res.send(rows);
            }
        })
    })
    return router;
};