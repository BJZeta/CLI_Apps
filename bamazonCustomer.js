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
    console.log("Hello, and Welcome to Bamazon :)");
    console.log('\n---------------------------\n');
    setTimeout(function () {
        runCustomer();
    }), 4000

});

function runCustomer() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
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
            },
            {
                name: "price",
                type: "number",
                message: "How many would you like to purchase?"
            }
        ]).then(function (answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, [{ product_name: answer.choices }], function (err, results) {
                if (answer.price <= results[0].stock_quantity || results[0].stock_quantity === 0) {
                    var newQty = results[0].stock_quantity - answer.price;
                    connection.query("UPDATE products SET ? WHERE ?", [
                        { stock_quantity: newQty },
                        { product_name: results[0].product_name }
                    ], function (err, res) {
                        console.log("Thank you for your purchase :)\n");
                        console.log("---------------------------\n");
                        console.log('We have ' + results[0].stock_quantity + '  left :)');
                        setTimeout(function () {
                            runCustomer();
                        }, 3000)
                    })
                } else {
                    console.log("nah fam, I checked the back and we OUT");
                    setTimeout(function () {
                        runCustomer();
                    }, 3000);
                }
            })
        })
    })
}