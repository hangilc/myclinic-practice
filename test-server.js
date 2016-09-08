var express = require("express");
var bodyParser = require("body-parser");
var config = require("./sample-config/practice-config");
var practice = require("./index");

var app = express();

var practiceApp = express();
practiceApp.use(bodyParser.urlencoded({extended: false}));
practiceApp.use(bodyParser.json());
practiceApp.use(express.static("static"));
practice.initApp(practiceApp, config);

app.use("/practice", practiceApp);

app.post("/shohousen", function(req, res){
	res.redirect(307, req.protocol + "://localhost:8081/shohousen");
});

app.post("/refer", function(req, res){
	res.redirect(307, req.protocol + "://localhost:8083/refer");
})

app.listen(8080, function(){
	console.log("server listening to 8080");
})

