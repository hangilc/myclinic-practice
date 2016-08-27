var express = require("express");
var service = require("./lib/service");
var noDbService = require("./lib/no-db-service");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var MasterMap = require("./master-map");
var NameMap = require("./master-name");

module.exports = function(config){
	if( config.masterMap ){
		MasterMap.import(config.masterMap);
	}
	if( config.nameMap ){
		NameMap.import(config.nameMap);
	}
	var app = express();
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use("/service", function(req, res){
		app.disable("etag");
		var q = req.query._q;
		if( q in noDbService ){
			noDbService[q](req, res, function(err, result){
				if( err ){
					console.log(err);
					res.status(500).send(err);
				} else {
					res.json(result);
				}
			});
		} else if( q in service ){
			var conn = mysql.createConnection(config.dbConfig);
			conn.beginTransaction(function(err){
				if( err ){
					console.log(err);
					res.status(500).send("cannot start transaction");
					return;
				}
				service[q](conn, req, res, function(err, result){
					if( err ){
						console.log(err);
						conn.rollback(function(rollbackErr){
							res.status(500).send(rollbackErr || err);
							conn.end();
						});
					} else {
						conn.commit(function(err){
							if( err ){
								console.log(err);
								console.log(err.stack);
								res.status(500).send(err);
							} else {
								if( result === undefined ){
									result = "ok";
								}
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