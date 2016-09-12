var express = require("express");
var bodyParser = require("body-parser");
var config = require("./sample-config/practice-config");
//var practice = require("./index");

var app = express();

function addSub(name){
	var pkg = require("myclinic-" + name);
	var config = require("./test-config/" + name + "-config");
	var subApp = express();
	subApp.use(bodyParser.urlencoded({extended: false}));
	subApp.use(bodyParser.json());
	pkg.initApp(subApp, config);
	if( "staticDir" in pkg ){
		subApp.use(express.static(pkg.staticDir));
	}
	app.use("/" + name, subApp);
}

function addPractice(){
	var pkg = require("./index");
	var config = require("./sample-config/practice-config");
	var subApp = express();
	subApp.use(bodyParser.urlencoded({extended: false}));
	subApp.use(bodyParser.json());
	pkg.initApp(subApp, config);
	if( "staticDir" in pkg ){
		subApp.use(express.static(pkg.staticDir));
	}
	app.use("/practice", subApp);
}

addSub("service");
addPractice();


// var practiceApp = express();
// practiceApp.use(bodyParser.urlencoded({extended: false}));
// practiceApp.use(bodyParser.json());
// practiceApp.use(express.static("static"));
// practice.initApp(practiceApp, config);
// if( "staticDir" in practice ){
// 	practiceApp.use(express.static(__dirname + "/" + practice.staticDir))
// }

// app.use("/practice", practiceApp);

// app.post("/shohousen", function(req, res){
// 	res.redirect(307, req.protocol + "://localhost:8081/shohousen");
// });

// app.post("/refer", function(req, res){
// 	res.redirect(307, req.protocol + "://localhost:8083/refer");
// })

app.listen(8080, function(){
	console.log("server listening to 8080");
})

