const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const ServiceLayer = require("./src/main/ServiceLayer");
const service = new ServiceLayer();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get("/api/login", (req, res) => {
  const username = req.query.username || "";
  const password = req.query.password || "";
  const result = service.login(username, password);
  res.send(JSON.stringify({ result }));
});

app.get("/api/logout", (req, res) => {
  const username = req.query.username || "";
  const result = service.logout(username);
  res.send(JSON.stringify({ result }));
});

app.get("/api/register", (req, res) => {
  const username = req.query.username || "";
  const password = req.query.password || "";
  const permissions = req.query.permissions || "";
  const result = service.register(username, password, permissions);
  res.send(JSON.stringify({ result }));
});

app.get("/api/addNewEmployee", (req, res) => {
  const userName = req.query.userName || "";
  const password = req.query.password || "";
  const firstName = req.query.firstName || "";
  const lastName = req.query.lastName || "";
  const permission = req.query.permission || "";
  const contactDetails = req.query.contactDetails || "";
  const user = req.query.user || "";
  const result = service.addNewEmployee(
    userName,
    password,
    firstName,
    lastName,
    permission,
    contactDetails,
    user
  );
  res.send(JSON.stringify({ result }));
});

app.get("/api/editEmployee", (req, res) => {
  const userName = req.query.userName || "";
  const password = req.query.password || "";
  const firstName = req.query.firstName || "";
  const lastName = req.query.lastName || "";
  const permission = req.query.permission || "";
  const contactDetails = req.query.contactDetails || "";
  const user = req.query.user || "";
  const result = service.editEmployee(
    userName,
    password,
    firstName,
    lastName,
    permission,
    contactDetails,
    user
  );
  res.send(JSON.stringify({ result }));
});

app.get("/api/removeEmployee", (req, res) => {
  const userName = req.query.userName || "";
  const user = req.query.user || "";
  const result = service.deleteEmployee(userName, user);
  res.send(JSON.stringify({ result }));
});

app.get("/api/editMovie", (req, res) => {
  const movieName = req.query.movieName || "";
  const category = req.query.category || "";
  const key = req.query.key || "";
  const examinationRoom = req.query.examinationRoom || "";
  const user = req.query.user || "";
  const result = service.editMovie(
    movieName,
    category,
    key,
    examinationRoom,
    user
  );
  res.send(JSON.stringify({ result }));
});

app.get("/api/removeMovie", (req, res) => {
  const movieName = req.query.movieName || "";
  const user = req.query.user || "";
  const result = service.removeMovie(movieName, user);
  res.send(JSON.stringify({ result }));
});

app.get("/api/addNewSupplier", (req, res) => {
  const name = req.query.name || "";
  const contactDetails = req.query.contactDetails || "";
  const user = req.query.user || "";
  const result = service.addNewSupplier(name, contactDetails, user);
  res.send(JSON.stringify({ result }));
});

//not yet
app.get("/api/editNewSupplier", (req, res) => {
  const name = req.query.name || "";
  const contactDetails = req.query.contactDetails || "";
  const user = req.query.user || "";
  const result = service.addNewEmployee(name, contactDetails, user);
  res.send(JSON.stringify({ result }));
});
//not yet
app.get("/api/removeNewSupplier", (req, res) => {
  const name = req.query.userName || "";
  const contactDetails = req.query.contactDetails || "";
  const user = req.query.user || "";
  const result = service.addNewEmployee(name, contactDetails, user);
  res.send(JSON.stringify({ result }));
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
