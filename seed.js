var seeder = require("mongoose-seed");
var mongoose = require("mongoose");

// Connect to MongoDB via Mongoose
seeder.connect(
  "mongodb://localhost:27017/db_staycation",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
  function () {
    // Load Mongoose models
    seeder.loadModels(["./models/Testimonial"]);

    // Clear specified collections
    seeder.clearModels(["Testimonial"], function () {
      // Callback to populate DB once collections have been cleared
      seeder.populateModels(data, function () {
        seeder.disconnect();
      });
    });
  }
);

var data = [
  // start booking
  {
    model: "Testimonial",
    documents: [
      {
        _id: mongoose.Types.ObjectId("5e96cbe292b97300fc90cbb1"),
        name: "Happy Family",
        familyName: "Bowo",
        familyOccupation: "UX/UX",
        content: "Great Trip",
        rate: 4.55,
        imageUrl: "images/testimonial2.jpg",
      },
    ],
  },
  // end booking
];
