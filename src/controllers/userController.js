const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'MY_SECRET_KEY';
const mongoose = require("mongoose");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user with the provided email already exists
    const checkExistingUser = await userModel.findOne({ email: email });

    if (checkExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided data
    const result = await userModel.create({
      username: username, 
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: result.email, id: result.id },
      SECRET_KEY
    );

    res.status(201).json({ user: result, token: token });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in signup" });
  }
};

//this is working now 
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not Found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );
    res.status(200).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

module.exports = { signup, signin };