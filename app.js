const express = require("express");
const { connection } = require("./config");
const { User_model } = require("./models/UserDb_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log(process.env.password);
  res.send(
    '<a href="https://github.com/login/oauth/authorize?client_id=d30b850d22865de09ffd">Login via github</a>',
  );
});

// https://github.com/login/oauth/authorize?client_id=d30b850d22865de09ffd

app.post("/signup", async (req, res) => {
  let { email, password, age } = req.body;

  await bcrypt.hash(password, 8, function (err, hash) {
    // Store hash in your password DB.
    if (err) {
      return res.send("Sign up failed, please try again later");
    }

    const user = new User_model({
      email,
      password: hash,
      age,
    });

    user.save();
    return res.send("Sign up successfull");
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  const user = await User_model.find({ email });
  const hashed_password = user[0].password;

  await bcrypt.compare(password, hashed_password, function (err, result) {
    // result == true
    if (err) {
      return res.send("Please try again");
    }

    if (result) {
      const token = jwt.sign(
        { email: user.email, age: user.age, _id: user._id },
        "secret",
      );

      if (user.length == 0) {
        return res.send("Check Credentials and try again");
      }

      return res.send({ message: "Login Successfull", token: token });
    } else {
      return res.send("Check Credentials and try again");
    }
  });

  //   console.log(user);
});

app.get("/profile/:id", async (req, res) => {
  const id = req.params.id;
  //   const { token } = req.query;
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "secret", function (err, decoded) {
    if (err) {
      return res.send("Please login again");
    }
    console.log("decoded", decoded);
  });

  try {
    const user = await User_model.find({ _id: id });
    return res.send(user);
  } catch (error) {
    return res.send("User not found");
  }
});

app.get("/dashboard", (req, res) => {
  const { code } = req.query;
  console.log(code);
  return res.send("Dashboard after login success");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }

  console.log("Listening to port 8080");
});

// d30b850d22865de09ffd
