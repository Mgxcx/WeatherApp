var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  "mongodb+srv://Mgxcx:Cremeoignons93@cluster0.hwgmx.mongodb.net/weather?retryWrites=true&w=majority",
  options,
  function (err) {
    console.log(err);
  }
);
