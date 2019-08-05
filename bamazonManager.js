var mysql = require("mysql")
var chalk = require("chalk")
var inquirer = require("inquirer")
var cTable = require("console.table")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;

  console.log("\nConnected as ID: " + connection.threadId + "\n");
  console.log(chalk.underline.bold("Welcome to the Bamazon Manger Client: \n"))
  mainMenu()
})

function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
      name: "choice"
    })
    .then(function (res) {
      switch (res.choice) {
        case "View All Products":
          viewProducts()
          break;

        case "View Low Inventory":
          viewLowInv()
          break;

        case "Add to Inventory":
          addInventory()
          break;

        case "Add New Product":
          addNewProduct()
          break;

        case "Exit":
          console.log("\nLogging off...")
          connection.end()
          break;

        default:
          console.log("Error in mainMenu")
          connection.end()
          break;
      }
    })
}

function viewProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    console.log(chalk.underline.bold("\nListing all products: \n"))
    console.table(res)
    mainMenu()
  })
}

function viewLowInv() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw err;

    console.log(chalk.underline.bold("\nListing items with low stock: \n"))
    console.table(res)
    mainMenu()
  })
}

function addInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    console.log(chalk.underline.bold("\nListing all products: \n"))
    console.table(res)

    inquirer
      .prompt([
        {
          message: "Enter the ID of the item you are adding stock to: ",
          name: "id",
          validate: function(value) {
            if (isNaN(value)) {
              return false
            } else {
              return true
            }
          }
        },
        {
          message: "How many units are you adding?",
          name: "count",
          validate: function(value) {
            if (isNaN(value)) {
              return false
            } else {
              return true
            }
          }
        }
      ])
      .then(function (res) {
        var itemId = res.id
        var addCount = res.count

        connection.query(
          "UPDATE products SET stock_quantity = stock_quantity + " + addCount + " WHERE ?",
          [
            {
              item_id: itemId
            }
          ],
          function (err) {
            if (err) throw err

            console.log("\nStock added!")
            viewProducts()
          }
        )
      })
  })
}

function addNewProduct() {
  console.log("\nAdding new item...\n")

  inquirer
    .prompt([
      {
        message: "Enter a name for the product: ",
        name: "name",
        validate: function (value) {
          if (value.length === 0) {
            return false
          } else {
            return true
          }
        }
      },
      {
        message: "Enter a department for the product: ",
        name: "department",
        default: "Other"
      },
      {
        message: "Enter a price for the product: ",
        name: "price",
        validate: function(value) {
          if (isNaN(value) || value.length === 0) {
            return false
          } else {
            return true
          }
        }
      },
      {
        message: "Enter a stock count for the product: ",
        name: "stock",
        validate: function(value) {
          if (isNaN(value) || value.length === 0) {
            return false
          } else {
            return true
          }
        }
      }
    ])
    .then(function (res) {
      connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(\"" + res.name + "\", \"" + res.department + "\", " + res.price + ", " + res.stock + ")",
        function (err) {
          if (err) throw err

          console.log("\nProduct added!\n")
          viewProducts()
        }
      )
    })
}