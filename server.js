const express = require("express");

const { initializeData } = require("./helpers/initializeData");
const { loadData } = require("./helpers/loadData");
const { saveData } = require("./helpers/saveData");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static("public"));
initializeData();

app.get("/api/data", (req, res) => {
  res.json(loadData());
});

app.post("/api/data", (req, res) => {
  saveData(req.body);
  res.status(200).send("Data saved successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
