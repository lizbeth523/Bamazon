var ct = require("console.table");
var inquirer = require("inquirer");
var mysql = require("mysql");
var itemNames;
var itemInfo;

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


// Add a new product to the inventory
function addNewProduct() {
	console.log("\nPlease enter the following information for the product that you would like to add:");
	inquirer.prompt([
	{
		type: "input",
		message: "Product name:",
		name: "itemName"
	},
	{
		type: "input",
		message: "Department:",
		name: "department"
	},
	{
		type: "input",
		message: "Price:",
		name: "price",
		validate: function(value) {
			if (value.match(/^[0-9]*\.[0-9]{2}$/)) {
				return true;
			}
			else {
				return "The value you have entered is not a valid price.";
			}
		}
	},
	{
		type: "input",
		message: "Quantity:",
		name: "qtyAdded",
		validate: validateQuantityAdded
	},
	{
		type: "confirm",
		message: "Are you sure?",
		name: "confirmAdd"
	}
	]).then( function(answers) {
		if (answers.confirmAdd) {
			var query = "INSERT INTO inventory (product_name, department_name, price, stock_quantity) ";
			query += "VALUES ('" + answers.itemName + "', '" + answers.department + "', " + answers.price + ", " + answers.qtyAdded + ");";
			updateDatabase(query);
		}
		else {
			chooseAction();
		}
	});
}


// Add more of an item that already exists in inventory
function addToInventory() {
	itemNames = [];
	itemInfo = [];
	var query = connection.query("SELECT * FROM inventory", function(err, res) {
		res.forEach( function(element) {
			itemNames.push(element.product_name);
			itemInfo.push({
				id: element.item_id,
				name: element.product_name,
				quantity: element.stock_quantity
			});
		});
		inquirer.prompt([
		{
			type: "list",
			message: "Which item would you like to add additional inventory?",
			name: "itemName",
			choices: itemNames
		},
		{
			type: "input",
			message: "How many would you like to add?",
			name: "qtyAdded",
			validate: validateQuantityAdded
		},
		{
			type: "confirm",
			message: "Are you sure?",
			name: "confirmAdd"
		}
		]).then( function(answers) {
			if (answers.confirmAdd) {
				var index = itemNames.indexOf(answers.itemName);
				var newQty = parseInt(itemInfo[index].quantity + parseInt(answers.qtyAdded));
				var queryStatement = "UPDATE inventory SET stock_quantity = ? WHERE item_id = ?";
				var queryArray = [newQty, itemInfo[index].id];
				updateDatabase(queryStatement, queryArray);
			}
			else {
				chooseAction();
			}
		});
	});
}


// Get the user's input for what they want to do and call the appropriate function
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
				displayInventory("SELECT * FROM inventory");
				break;
			case "View Low Inventory":
				displayInventory("SELECT * FROM inventory WHERE stock_quantity < 5");
				break;
			case "Add to Inventory":
				addToInventory();
				break;
			case "Add New Product":
				addNewProduct();
				break;
			case "Exit":
				connection.end();
		}
	});
}


// Displays inventory that is selected from the queryStatement
function displayInventory(queryStatement) {
	var query = connection.query(queryStatement, function(err, res) {
		if (err) {
			throw err;
		}
		console.log();
		console.table(res);
		console.log();
		chooseAction();
	});
}


// Update the database
function updateDatabase(queryStatement, queryArray) {
	var query = connection.query(queryStatement, queryArray, function(err, res) {
		if (err) {
			throw err;
		}
		console.log("Inventory has been successfully updated\n");
		chooseAction();
	});
}


var validateQuantityAdded = function(value) {
	if (value.match(/\D/)) {
		return "Please enter a number";
	}
	else if (value < 1) {
		return "Number of items must be at least 1";
	}
	else {
		return true;
	}
}


