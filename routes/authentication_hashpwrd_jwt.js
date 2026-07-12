const express = require("express");
const router = express.Router();
const pool = require("../db-connection.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




// SIGNUP
router.post("/signup", async (req, res) => {

  const { firstname, lastname, phone, email, dob, password } = req.body;

  try {

    const newUser = await pool.query(
      "INSERT INTO users (firstname, lastname, phone, email, dob, password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [firstname, lastname, phone, email, dob, password]
    );

    res.json(newUser.rows[0]);

  } catch (err) {
    console.error(err.message);
  }

});


// LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (user.rows.length === 0) {
      return res.json({ message: "Invalid credentials" });
    }

    res.json(user.rows[0]);

  } catch (err) {
    console.error(err.message);
  }

});

module.exports = router;