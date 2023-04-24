const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.path, req.method)
  console.log(new Date().toLocaleString("en-GB", { hour12: false }, {timeZone: "Canada/Montreal"}))
  next()
})

// routes
app.use(require('./routes/user'));
app.use(require('./routes/record'));

// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
});
