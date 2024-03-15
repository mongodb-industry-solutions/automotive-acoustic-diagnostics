const { version, Chip, Line } = require("node-libgpiod");
const express = require("express");

const app = express();

app.chip = new Chip(4); // using Chip(4) as explained here: https://forums.raspberrypi.com/viewtopic.php?t=364182
app.line = app.chip.getLine(16)

app.line.requestOutputMode()
app.line.setValue(1);


app.get("/stop", function(req, res){
	console.log("Stop")
	app.line.setValue(1);
	res.send("Stop")

})

app.get("/start", function(req, res){					
	console.log("Start")
	app.line.setValue(0);
	res.send("Start")


})

app.listen(3000)

console.log("Server running on port 3000")

process.on("SIGINT", async () =>{

	app.line.setValue(1);
	console.log("\nClosing Server, stopping Engine!")
	process.exit(0)
})