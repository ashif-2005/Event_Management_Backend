const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");

const Signup = async (req, res) => {
  try {
    const { userName, phone, password, location } = req.body;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      phone,
      password: hashedPassword,
      location,
    });
    await user.save();
    res
      .status(200)
      .json({ error: false, messsage: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userName: user.userName, role: user.role },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
    res.json({ error: false, message: "User logged in successfully", token });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { Signup, Login };
