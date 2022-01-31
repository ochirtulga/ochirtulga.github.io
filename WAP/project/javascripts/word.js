exports.findWord = function(req, res, word) {
    var mysql = require('mysql');
    //config for your database
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "entries",
    });
    
    // connect to your database
    con.connect(function(err) {
        if (err) throw (err);
        console.log("Connected!");
    });

    // query to the database and get the records
    var select = mysql.format("select * from entries where word='" + word + "'");

    con.query(select, function(err, results) {
        if (err) console.log(err);
        // send records as a response
        res.send(results);
    });
};