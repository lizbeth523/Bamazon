var inquirer = require("inquirer");
var mysql = require("mysql");
var listOfItems;
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

	console.log("Connected! Connection id is " + connection.threadId + "\n");
	displayInventory();
	chooseItemToBuy();
	connection.end();
});


function displayInventory() {
	var header = "Product Name\t\tDepartment Name\tPrice\tQuantity In Stock";
	// Line of dashes to separate column headers for table contents
	var line = "";
	for (var i = 0; i < 65; i++) {
		line += "-";
	}
	console.log(header + "\n" + line);
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
	});
}


// Allow customer to choose what item and how many they would like to purchase
function chooseItemToBuy() {
	var query = connection.query("SELECT * FROM inventory", function(err, res) {
		if (err) {
			throw err;
		}
		listOfItems = [];
		res.forEach(function(element) {
		    listOfItems.push(element.product_name);
		});
		inquirer.prompt([
			{
				type: "list",
				message: "Which item would you like to buy?",
				name: "item",
				choices: listOfItems
			},
			{
				type: "input",
				message: "How many would you like?",
				name: "quantity",
				validate: function(value) {
					if (!value.match(/\d/) || value.match(/[.,$]/)) {
						return "Please enter a number ";
					}
					else if (value < 1) {
						return "Quantity to purchase must be at least 1";
					}
					else {
						return true;
					}
				}
			},
			{
				type: "confirm",
				message: "Are you sure?",
				name: "confirmPurchase"
			}
		]).then(function(answers) {
			if (answers.confirmPurchase) {
				placeOrder(answers.item, answers.quantity);
			}
			else {
				console.log("Your purchase of " + answers.item + " has been cancelled");
			}
		});
	});
}


// Checks to verify sufficient quantity for order. If sufficient qty, then inventory is updated to reflect purchase
// If insufficient quantity, customer is notified that their order can't be completed
function placeOrder(item, qty) {

}
 
