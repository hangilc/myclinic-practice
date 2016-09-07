var app = require("express")();
var config = require("./test-config");
var practice = require("./index")(config);

app.use("/practice", practice);

app.post("/shohousen", function(req, res){
	res.redirect(307, req.protocol + "://localhost:8081/shohousen");
});

app.post("/refer", function(req, res){
	res.redirect(307, req.protocol + "://localhost:8083/refer");
})

app.listen(8080, function(){
	console.log("server listening to 8080");
})

