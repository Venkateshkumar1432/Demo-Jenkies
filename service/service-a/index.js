const express = require("express");
const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Hello from Service A ✨");
});

app.listen(PORT, () => {
  console.log(`Service A running on port ${PORT}`);
});
