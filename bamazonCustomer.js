var mysql = require('mysql');
var inquirer = require('inquirer');
var fs = require('fs');

var connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'root',

    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;
    runCustomer();
});

function runCustomer() {
    connection.query("SELECT * FROM products",function (err, results) {
        if (err) throw err;
        inquirer.prompt({
            name: "choices",
            type: "rawlist",
            message: "What would you like to purchase?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                }
                return choiceArray;
            }
        }).then(function (answer) {
            console.log('this works');
            console.log(answer);
        })
    })
}