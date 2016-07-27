var app = require("express")();
var config = require("./test-config");
var practice = require("./index")(config);

app.use("/practice", practice);

app.listen(8080, function(){
	console.log("server listening to 8080");
})

