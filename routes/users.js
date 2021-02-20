var express = require("express");
var router = express.Router();
var request = require("sync-request");
var allData = require("../models/cities");
var allUsers = require("../models/users");

/* GET users listing. */

router.post("/sign-up", async function (req, res, next) {
  var searchUser = await allUsers.userModel.findOne({ emailaddress: req.body.email });

  if (!searchUser) {
    var newUser = new allUsers.userModel({
      username: req.body.username,
      emailaddress: req.body.email,
      password: req.body.password,
    });
    var newUser = await newUser.save();

    req.session.user = {
      username: req.body.username,
      id: newUser._id,
    };
    res.redirect("/weather");
  } else {
    res.render("login");
  }
});

router.post("/sign-in", async function (req, res, next) {
  var searchUser = await allUsers.userModel.findOne({ emailaddress: req.body.email, password: req.body.password });

  if (searchUser) {
    req.session.user = { username: searchUser.username, id: searchUser._id };
    res.redirect("/weather");
  } else {
    res.render("login");
  }
});

router.get("/logout", async function (req, res, next) {
  req.session.user = null;
  res.redirect("/");
});

module.exports = router;
