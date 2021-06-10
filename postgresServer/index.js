const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = 3000;
const https = require("https");
const fs = require("fs");
var cors = require("cors");
const cookieParser = require("cookie-parser");
// Cookies enable
app.use(cookieParser());
// enable CORS
app.use(cors());
// Body parser for JSON processing
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
// Visitors database
app.get("/visitors", db.getVisitor);
app.get("/visitors/:id", db.getVisitorById);
app.put("/users/:id", db.updateVisitor);
app.post("/visitors", db.createVisitor);
// Answers database
app.post("/answers", db.createAnswer);
// Questions database
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)
app.get("/questions/:id", db.getQuestionsByStand);
app.get("/questionsen/:id", db.getQuestionsenByStand);

fs.readFileSync("/etc/nginx/ssl/tetem-reflectie.nl.key");

// we will pass our 'app' to 'https' server
https
  .createServer(
    {
      key: fs.readFileSync("/etc/nginx/ssl/tetem-reflectie.nl.key"),
      cert: fs.readFileSync("/etc/nginx/ssl/tetem-reflectie.nl.crt"),
    },
    app
  )
  .listen(port, () => {
    console.log(`App running on port ${port}.`);
  });

//app.listen(port, () => {
//  console.log(`App running on port ${port}.`);
//});
