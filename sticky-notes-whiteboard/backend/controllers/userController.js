const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const { client } = require('../db/config');

const signup = async (req, res) => {
      const { email, password } = req.body;

      try {
        // Check if the email is already registered
        const existingUser = await client.query(
          "SELECT id FROM users WHERE email = $1",
          [email]
        );
        if (existingUser.rows.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const result = await client.query(
          "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
          [email, hashedPassword]
        );

        const user = result.rows[0];

        res.status(201).json(user);
      } catch (err) {
        console.error("Error in signup:", err.message);
        res.status(500).json({ message: "Internal server error" });
      }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userQuery = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await client.query('SELECT FROM users WHERE email=$1', [email]);
    if (!result) {
      res.status(404).json({message:"Email Not found"})
    }
    const result1 = await client.query('DELETE FROM users WHERE email=$1', [email]);
    res.status(200).json({ message:'Deleted Successfully'})
  } catch (err) {
    console.error("Error in Deletion", err.message)
    res.status(500).json({message:"Internal Server Error"})
  }
}

module.exports = { signup,login,deleteUser };
