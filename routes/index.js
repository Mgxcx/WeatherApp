var express = require("express");
var router = express.Router();
var request = require("sync-request");
var allData = require("../models/cities");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.get("/weather", async function (req, res, next) {
  if (req.session.user) {
    var cityList = await allData.cityModel.find();
    res.render("weather", { cityList, error: false });
  } else {
    res.redirect("/");
  }
});

router.post("/add-city", async function (req, res, next) {
  var weather = request(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&appid=2739609c9bd03378873b85bb81d9e0a1&lang=fr&units=metric`
  );
  weather = JSON.parse(weather.body);

  var cityList = await allData.cityModel.find();

  var alreadyExist = false;
  var error = false;

  for (var i = 0; i < cityList.length; i++) {
    if (req.body.newcity.toLowerCase() == cityList[i].name.toLowerCase()) {
      alreadyExist = true;
    }
  }

  if (alreadyExist == false && weather.cod == "200") {
    var newWeather = new allData.cityModel({
      name: req.body.newcity,
      desc: weather.weather[0].description,
      img: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
      temp_min: weather.main.temp_min,
      temp_max: weather.main.temp_max,
      lon: weather.coord.lon,
      lat: weather.coord.lat,
    });
    await newWeather.save();
  }

  if (weather.cod == "400" || weather.cod == "404" || weather.cod == "500") {
    error = true;
  }

  cityList = await allData.cityModel.find();

  res.render("weather", { cityList, error });
});

router.get("/delete-city", async function (req, res, next) {
  await allData.cityModel.deleteOne({ _id: req.query.id });
  var cityList = await allData.cityModel.find();

  res.render("weather", { cityList, error: false });
});

router.post("/update-cities", async function (req, res, next) {
  var cityList = await allData.cityModel.find();

  for (var i = 0; i < cityList.length; i++) {
    var weather = request(
      "GET",
      `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&appid=2739609c9bd03378873b85bb81d9e0a1&lang=fr&units=metric`
    );
    weather = JSON.parse(weather.body);

    await allData.cityModel.updateOne(
      { _id: cityList[i].id },
      {
        name: cityList[i].name,
        desc: weather.weather[0].description,
        img: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        temp_min: weather.main.temp_min,
        temp_max: weather.main.temp_max,
      }
    );
  }
  cityList = await allData.cityModel.find();

  res.render("weather", { cityList, error: false });
});

module.exports = router;
