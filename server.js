//pega a biblioteca express
var express = require('express'); 
//Cria o objeto do servidor usando a biblioteca
var server = express(); 
server.use(express.static(__dirname + '/public'));
server.listen(8080);