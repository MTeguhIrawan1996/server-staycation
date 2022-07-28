var seeder = require("mongoose-seed");
var mongoose = require("mongoose");

// Connect to MongoDB via Mongoose
seeder.connect(
  "mongodb://onedev:CCZ1aycFC3ZLXOtw@ac-uhslq4o-shard-00-00.fxyat2f.mongodb.net:27017,ac-uhslq4o-shard-00-01.fxyat2f.mongodb.net:27017,ac-uhslq4o-shard-00-02.fxyat2f.mongodb.net:27017/db_staycation?ssl=true&replicaSet=atlas-82jsad-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
  function () {
    // Load Mongoose models
    seeder.loadModels(["./models/User"]);

    // Clear specified collections
    seeder.clearModels(["User"], function () {
      // Callback to populate DB once collections have been cleared
      seeder.populateModels(data, function () {
        seeder.disconnect();
      });
    });
  }
);

var data = [
  {
    model: "User",
    documents: [
      {
        _id: mongoose.Types.ObjectId("5e96cbe292b97300fc903345"),
        username: "admin",
        password: "rahasia",
      },
    ],
  },
  // end booking
];
