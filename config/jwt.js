let jwt = require("jsonwebtoken");
let jwtObj = {};
jwt.sign ({test : 'test'},jwtObj.secret = "apple",{subject : "jwtToken",expiresIn : "5m",issuer : "pang"});
module.exports = jwtObj