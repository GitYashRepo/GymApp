require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1/api/users", require("./routes/userAuth.routes"));
app.use("/v1/api/admin", require("./routes/adminAuth.routes"));
app.use("/v1/api/pods", require("./routes/gymPod.routes"));


module.exports = app;
