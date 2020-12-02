const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded());
require('dotenv').config();

const { Pool } = require("pg");

const pool = new Pool({
  user: "osagie",
  host: "localhost",
  database: "cyf_ecommerce",
  password: process.env.DB_PASSWORD,
  port: 5432,
});
 
// app.get("/products", function (req, res) {
//   pool.query("SELECT * FROM products", (error, result) => {
//     res.json(result.rows);
//   });
// });

app.get("/products", function (req, res) {
  const queryList = req.query.name;
  let query = `SELECT * FROM products ORDER BY product_name`;

  if(queryList) {
    query = `SELECT * FROM products WHERE product_name LIKE '$%{queryList}%'`;
  }
  pool.query(query)
  .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
}); 

app.get("/customers/:id", function (req, res) {
  const customerId = req.params.id;
  
  pool
    .query("SELECT * FROM customers WHERE id = $1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
}); 
 
app.post("/customers", (req, res) => {
  const newCustomerName = req.body.name;
  const newCustomerAddress = req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerCountry = req.body.country;

  const query =
    "INSERT INTO customers (name, address, city, country) VALUES ('Mario Balotelli', '89 Pizza Street', 'Milan', 'Italy')";
    if (typeof newCustomerName !== "string") {
    return res.status(400).send("Customer's name must be words or alphabets");
  }
  pool
    .query(query, [newCustomerName, newCustomerAddress, newCustomerCity, newCustomerCountry])
    .then(() => res.send("New customer created!"))
    .catch((e) => console.error(e));
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});
