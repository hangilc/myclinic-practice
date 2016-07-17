var express = require("express");
var service = require("./lib/service");
var mysql = require("mysql");

var config = {
	host: "127.0.0.1",
    user: process.env.MYCLINIC_DB_USER,
    password: process.env.MYCLINIC_DB_PASS,
    database: "myclinic",
    dateStrings: true
};

module.exports = function(){
	var app = express();

	app.use("/service", function(req, res){
		app.disable("etag");
		var q = req.query._q;
		if( q in service ){
			var conn = mysql.createConnection(config);
			conn.beginTransaction(function(err){
				if( err ){
					res.status(500).send("cannot start transaction");
					return;
				}
				service[q](conn, req, res, function(err, result){
					if( err ){
						conn.rollback(function(rollbackErr){
							res.status(500).send(rollbackErr || err);
							conn.end();
						});
					} else {
						conn.commit(function(err){
							if( err ){
								res.status(500).send(err);
							} else {
								res.json(result);
							}
							conn.end();
						})
					}
				});
			});
		} else {
			res.sendStatus(400);
		}
	});
	app.use(express.static("static"));

	return app;
}