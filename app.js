var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const moment = require("moment");
require("dotenv").config();

// Import Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.URL_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// Router admin
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const apiRouter = require("./routes/api");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);
app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/sb-admin2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);

app.use("/", indexRouter);
// app.use("/users", usersRouter);

// admin
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/api/v1/member", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
