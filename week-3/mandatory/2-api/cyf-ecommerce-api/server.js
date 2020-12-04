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

app.post("/customers", (req, res) => {
  const newCustomerName = req.body.name;
  const newCustomerAddress = req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerCountry = req.body.country;

  const query =
    "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4) returning *";

  pool
    .query(query, [
      newCustomerName,
      newCustomerAddress,
      newCustomerCity,
      newCustomerCountry,
    ])
    .then(() => res.json(query.rows))
    .catch((e) => console.error(e));
});

app.post("/products", (req, res) => {
  console.log(req.params.id);
  const newProductName = req.body.product_name;
  const newUnitPrice = req.body.unit_price;
  const supplierId = req.body.supplier_id;
  if (!Number.isInteger(newUnitPrice)) {
    return res.status(400).send("Product unit price must be an integer");
  }
  pool
    .query("SELECT * FROM products WHERE supplier_id=$1", [supplierId])
    .then((result) => {
      if (result.rows.length > 0) {
        const query =
          "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)";
        pool
          .query(query, [newProductName, newUnitPrice, supplierId])
          .then((result) => res.json(result.rows))

          .catch((e) => console.error(e));
      } else {
        return res.status(202).send("The supplier exists on the database!");
      }
    });
});

app.listen(3003, function () {
  console.log("Server is listening on port 3003. Ready to accept requests!");
});
