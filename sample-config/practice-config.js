"use strict";

var fs = require("fs");

module.exports = {
	dbConfig: {
		host: "127.0.0.1",
	    user: process.env.MYCLINIC_DB_USER,
	    password: process.env.MYCLINIC_DB_PASS,
	    database: "myclinic",
	    dateStrings: true
	},
	masterMap: __dirname + "/practice-master-map.txt",
	nameMap: __dirname + "/practice-master-name.txt",
	houkatsuList: JSON.parse(fs.readFileSync(__dirname + "/practice-rcpt-houkatsu.json", "utf-8")).houkatsu
};