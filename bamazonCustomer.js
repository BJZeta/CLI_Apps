var mysql = require('mysql');
var inquirer = require('inquirer');
var fs = require('fs');

var connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: '',

    database: 'bamazon_db'
});