const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { upload, uploadMultiple } = require("../middlewares/multer");

router.get("/", adminController.viewDashboard);
router.get("/dashboard", adminController.viewDashboard);

// endpoint Category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// endpoint Bank
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

// endpoint item
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id", adminController.deleteItem);

// Endpoint Feture
router.get("/item/show-detail-item/:itemId", adminController.ViewDetailItem);
router.post("/item/add/feature", upload, adminController.addFeature);
router.put("/item/edit/feature", upload, adminController.editFeature);
router.delete("/item/:itemId/feature/:id", adminController.deleteFeature);

router.get("/booking", adminController.viewBooking);

module.exports = router;
