const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

// Read & write helper functions
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 🧑‍🎓 Student Request
app.post("/request", (req, res) => {
  const { studentId, reason } = req.body;
  const data = readData();

  // Generate date and time
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const newRequest = {
    id: Date.now(),
    studentId,
    reason,
    date,
    time,
    status: "pending",
    remarks: ""
  };

  data.requests.push(newRequest);
  writeData(data);
  res.json({ message: "Request submitted", request: newRequest });
});

// 🧑‍🏫 Moderator Decision
app.post("/moderate", (req, res) => {
  const { id, status, remarks } = req.body;
  const data = readData();
  const request = data.requests.find(r => r.id == id);

  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = status;
  request.remarks = remarks;
  writeData(data);
  res.json({ message: "Request updated", request });
});

// 🚪 Gatekeeper Check
app.get("/scan/:id", (req, res) => {
  const data = readData();
  const request = data.requests.find(r => r.id == req.params.id);
  if (!request) return res.status(404).json({ message: "Invalid Pass" });
  res.json(request);
});

// 👀 Moderator - view all requests
app.get("/scan/all", (req, res) => {
  const data = readData();
  res.json(data);
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
