const router = require("express").Router();
const apiController = require("../controllers/apiController");
const { upload } = require("../middlewares/multer");
const { body } = require("express-validator");

router.get("/landing-page", apiController.landingPage);
router.get("/detail-page/:id", apiController.detailPage);
router.post(
  "/booking-page",
  upload,
  [
    body("idItem").isLength({ min: 5 }).withMessage("Input tidak sesuai"),
    body("duration").isLength({ min: 1 }).withMessage("Input tidak sesuai"),
    body("bookingStartDate")
      .isLength({ min: 5 })
      .withMessage("Input tidak sesuai"),
    body("bookingEndDate")
      .isLength({ min: 5 })
      .withMessage("Input tidak sesuai"),
    body("firstName").isLength({ min: 3 }).withMessage("Input tidak sesuai"),
    body("lastName")
      .isLength({ min: 3 })
      .withMessage("Input tidak sesuai")
      .trim(),
    body("email").notEmpty().isEmail().withMessage("Input tidak sesuai"),
    body("phoneNumber").isLength({ min: 5 }).withMessage("Input tidak sesuai"),
    body("accountHolder")
      .isLength({ min: 3 })
      .withMessage("Input tidak sesuai"),
    body("bankFrom").isLength({ min: 5 }).withMessage("Input tidak sesuai"),
  ],
  apiController.bookingPage
);

module.exports = router;
