// var express = require("express");
const adminController = require("../controllers/adminController");
const router = require("express").Router();

// var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get("/", adminController.viewDashboard);

module.exports = router;
