var app = require("express")();
var practice = require("./index")();

app.use("/practice", practice);

app.listen(8080, function(){
	console.log("server listening to 8080");
})

