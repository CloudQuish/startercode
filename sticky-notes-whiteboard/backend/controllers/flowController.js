const { client } = require("../db/config");

const createFlow = async (req, res) => {
  const { content, title} = req.body;
  const userId = req.user.id; // Ensure you have user authentication middleware

  try {
    // Insert flow with position data
    const result = await client.query(
      "INSERT INTO flows (user_id, content, title) VALUES ($1, $2, $3) RETURNING id",
      [userId, content, title]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ message: "Error creating flow" });
  }
};

const getFlows = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await client.query(
      "SELECT * FROM flows WHERE user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching flows" });
  }
};

const getFlowById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await client.query(
      "SELECT * FROM flows WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Flow not found" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching flow" });
  }
};


const deleteFlow = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await client.query(
      "DELETE FROM flows WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Flow not found" });
    }
    res.status(200).json({message:"Deleted Node Successfully"});
  } catch (err) {
    res.status(500).json({ message: "Error deleting flow" });
  }
};

module.exports = { createFlow, getFlows, getFlowById, deleteFlow };
