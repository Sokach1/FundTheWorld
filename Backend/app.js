const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require('cors')
const path = require("path");


const loginRouter = require("./routes/login");
const regRouter = require("./routes/register");
const usersRouter = require("./routes/users");
const projectRouter = require("./routes/project");
const mainpageRouter = require("./routes/mainpage");

const app = express();

app.use(cors())

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static('public'));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));


app.use("/login", loginRouter);
app.use("/register", regRouter);
app.use("/users", usersRouter);
app.use("/project", projectRouter);
app.use("/mainpage", mainpageRouter);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));


app.listen(5000, () => {
    console.log("http://127.0.0.1:5000");
});



