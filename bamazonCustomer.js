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
  console.log("\nConnected as ID: " + connection.threadId);
  listProducts()
})

function listProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log(chalk.underline.bold("\nBamazon -- Your One-Stop Shop\n"))
    console.table(res)
    mainMenu()
  })
}

function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      message: "Welcome! What would you like to do?",
      choices: ["Purchase Item", "Exit"],
      name: "choice"
    })
    .then(function(res) {
      if (res.choice === "Purchase Item") {
        makePurchase()
      } else {
        console.log("\nBye for now!")
        connection.end()
      }
    })
}

function makePurchase() {
  inquirer
    .prompt([
      {
        type: "number",
        message: "Enter the ID of an item to purchase: ",
        name: "id"
      },
      {
        type: "number",
        message: "How many units would you like to buy?",
        name: "count"
      }
    ])
    .then(function (res) {
      var orderCount = res.count
      var orderValid = true
      var orderId = res.id

      connection.query("SELECT stock_quantity FROM products WHERE item_id = " + res.id, function (err, res) {
        if (err) throw err;

        if (orderCount > res[0].stock_quantity) {
          console.log("\nInsufficient quantity!\n")
          orderValid = false
          return listProducts()
        }
        
        if (orderValid) {
          updateProducts(orderId, orderCount)
        }
      })
    })
}

function updateProducts(orderId, orderCount) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - " + orderCount + " WHERE ?",
    [
      {
        item_id: orderId
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log("\nPurchase successful!\n")
      connection.query("SELECT price FROM products WHERE item_id = " + orderId, function (err, res) {
        if (err) throw err
        console.log("Total cost of order: $" + (orderCount * res[0].price).toFixed(2))
        console.log("\n\nWould you like anything else?")
        listProducts()
      })
    }
  )
}