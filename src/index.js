const express = require("express");
const cors = require("cors");
require('dotenv').config();

// App INIT
const app = express();

app.use(cors());

// Test route
app.get("/", (req, res) => {
  return res.send("<h3>API server is running</h3>");
});

// ENV Configs
const PORT = process.env.PORT || 5050;


// APP Listen
app.listen(PORT, () => {
  console.log(`CC API server started on port: ${PORT}`);
});
