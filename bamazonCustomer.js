var inquirer = require("inquirer");
var mysql = require("mysql");
var listOfItemNames;
var listOfItemInfo;

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
	goShopping();
});


function displayInventory() {
	var header = "Product Name\t\tDepartment Name\tPrice\tQuantity In Stock";
	// Line of dashes to separate column headers from table contents
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
function goShopping() {
	var query = connection.query("SELECT * FROM inventory", function(err, res) {
		if (err) {
			throw err;
		}
		listOfItemNames = [];
		listOfItemInfo = [];
		res.forEach(function(element) {
		    listOfItemNames.push(element.product_name);
		    listOfItemInfo.push({
		    	id: element.item_id,
		    	name: element.product_name,
		    	quantity: element.stock_quantity
		    })
		});
		inquirer.prompt([
			{
				type: "list",
				message: "Which item would you like to buy?",
				name: "item",
				choices: listOfItemNames
			},
			{
				type: "input",
				message: "How many would you like?",
				name: "quantity",
				validate: function(value) {
					if (value.match(/\D/)) {
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
				console.log("Your purchase has been cancelled");
			}
		});
	});
}


// Check to verify sufficient quantity for order. If sufficient qty, order is placed
// If insufficient quantity, customer is notified that their is insufficient inventory for their order
function placeOrder(item, qty) {
	var index = listOfItemNames.indexOf(item);

	if (listOfItemInfo[index].quantity >= qty) {
		console.log("Your order has been placed");
		updateInventory(listOfItemInfo[index].id, qty, index);
	}
	else {
		console.log("Insufficient quantity!");
		connection.end();
	}
	
}
 

// Update the database to reflect the new stock_quantity after a purchase
function updateInventory(id, qty, index) {
	var updatedStockQuantity = listOfItemInfo[index].quantity - qty;
	var queryStatement = "UPDATE inventory SET stock_quantity = ? WHERE item_id = ?";
	var queryArray = [updatedStockQuantity, id];
	var query = connection.query(queryStatement, queryArray, function(err, res) {
		if (err) {
			throw err;
		}
	});	
	// If no more stock remains, then remove the item from the list of inventory
	if (updatedStockQuantity === 0) {
		queryStatement = "DELETE FROM inventory WHERE item_id = ?";
		queryArray = [id];
		query = connection.query(queryStatement, queryArray, function(err, res) {
			if (err) {
				throw err;
			}
		});
	}
	connection.end();
} 
