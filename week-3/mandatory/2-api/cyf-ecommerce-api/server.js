const express = require("express");
const app = express();
app.use(express.json());
// app.use(express.urlencoded());
require('dotenv').config();

const { Pool } = require("pg");

const pool = new Pool({
  user: "osagie",
  host: "localhost",
  database: "cyf_ecommerce",
  password: process.env.DB_PASSWORD,
  port: 5432,
});
 
app.get("/products", function (req, res) {
  let query = `SELECT * FROM products ORDER BY product_name`;
  pool.query(query)
  .then((result) => res.status(200).json(result.rows))
  .catch((e) => console.error(e));
}); 

app.get("/products", function (req, res) {
  let queryList = req.query.name;
  let query = "SELECT * FROM products";
    if(queryList) {
      query = `SELECT * FROM products WHERE product_name LIKE '%${queryList}%'`;
    };
    pool
      .query(query)
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

app.listen(3002, function () {
  console.log("Server is listening on port 3006. Ready to accept requests!");
});
