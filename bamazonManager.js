var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'MyLongPassword1!',
  database : 'bamazon'
});

connection.connect( function (error) {
		if (error) {
			throw error;
		}
		chooseAction();
});


function displayInventory() {
	var header = "Product Name\t\tDepartment Name\tPrice\tQuantity In Stock";
	// Line of dashes to separate column headers from table contents
	var line = "";
	for (var i = 0; i < 65; i++) {
		line += "-";
	}
	console.log("\n" + header + "\n" + line);
	var query = connection.query("SELECT * FROM inventory", function(err, res) {
		if (err) {
			throw err;
		}
		for (item in res) {
			var itemDisplay = res[item].product_name;
			if (itemDisplay.length < 8) {
				itemDisplay += "\t";
			}
			if (itemDisplay.length < 15) {
				itemDisplay += "\t";
			}
			itemDisplay += "\t" + res[item].department_name + "\t";
			if (res[item].department_name.length < 5) {
				itemDisplay += "\t";
			}
			itemDisplay += res[item].price + "\t";
			itemDisplay += res[item].stock_quantity;
			console.log(itemDisplay);
		}
		console.log();
		chooseAction();
	});
}


function chooseAction() {
	inquirer.prompt([
	{
		type: "list",
		message: "Choose an option from the list below",
		name: "action",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
	}
	]).then( function(answers) {
		switch(answers.action) {
			case "View Products for Sale":
				displayInventory();
				break;
			case "View Low Inventory":
				// need to implement
				break;
			case "Add to Inventory":
				// need to implement
				break;
			case "Exit":
				connection.end();
		}
	});
}
