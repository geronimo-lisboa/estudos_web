//pega a biblioteca express
var express = require('express'); 
//Cria o objeto do servidor usando a biblioteca
var server = express(); 
server.use(express.static(__dirname + '/public'));
console.log('hello world, começando server');
//var HOST = 'ec2-54-200-54-146.us-west-2.compute.amazonaws.com';
//var PORT = 8080;
server.listen(8080);
