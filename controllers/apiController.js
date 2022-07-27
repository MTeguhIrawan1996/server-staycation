const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Traveler = require("../models/Booking");
const Category = require("../models/Category");
const Testimonial = require("../models/Testimonial");
const Bank = require("../models/Bank");
const { validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");

const removeImage = (filePath) => {
  filePath = path.join(__dirname, "../public", filePath);
  fs.unlink(filePath);
};

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city price unit imageId")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });
      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();
      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title country city isPopular imageId",
          perDocumentLimit: 4,
          options: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });
      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }
      const testimonial = await Testimonial.find();

      res.status(200).json({
        hero: {
          traveler: traveler.length,
          treasure: treasure.length,
          city: city.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "internal server Eror" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "featureId", select: "_id name qty imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({ path: "imageId", select: "_id imageUrl" });
      const bank = await Bank.find();
      const testimonial = await Testimonial.find();

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "internal server Eror" });
    }
  },

  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      bookingDateStart,
      bookingDateEnd,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;
    if (!req.file) {
      return res.status(404).json({ message: "image not found" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      removeImage(`images/${req.file.filename}`);
      return res
        .status(400)
        .json({ message: "Invalid Input", data: errors.array() });
    }

    res.status(201).json({ message: "succes booking" });
  },
};
