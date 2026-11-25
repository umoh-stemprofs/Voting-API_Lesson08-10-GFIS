const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const candidates = [
  { name: "Ada", votes: 0 },
  { name: "Tunde", votes: 0 },
  { name: "Chioma", votes: 0 }
];

app.get("/candidates", (req, res) => {
  res.json(candidates);
});

app.post("/vote", (req, res) => {
  const candidate = candidates.find(c => c.name === req.body.name);
  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }
  candidate.votes++;
  res.json(candidate);
});

app.listen(3000, () => {
  console.log("Connected, open your-IP:3000");
});