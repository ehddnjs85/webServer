module.exports = function() {
    var mysql = require('mysql');
  
    var conn = {
      host: "",
      user: "",
      password: "",
      database: "",
      multipleStatements : true 
    }
    
    var dbconn = {
      init : function() {
        return mysql.createConnection(conn);
      },
      dbopen : function(con) {
        con.connect(function(err) {
            if (err) {
                console.error("mysql connection error : " + err);
            } else {
                console.info("mysql connection successfully.");
            }
        });
      }
    }
    return dbconn;
  };