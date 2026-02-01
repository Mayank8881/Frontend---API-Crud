const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", require("./routes/Routes"));

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
