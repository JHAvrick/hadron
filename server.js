var express = require('express');
var app = express();
var path = require('path');

// __dirname will use the current path from where you run this file 
app.use(express.static(__dirname + "/build"));
app.use(express.static(path.join(__dirname + "/build", '/FOLDERTOHTMLFILESTOSERVER')));

app.listen(8000, "0.0.0.0");

console.log('Listening on port 8000');