const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const fs = require("fs-extra");
const path = require("path");

const removeImage = (filePath) => {
  filePath = path.join(__dirname, "../public", filePath);
  fs.unlink(filePath);
};

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", {
      page: "Dashboard",
      title: "Stycation | Dashboard",
    });
  },

  // Category CRUD
  viewCategory: async (req, res, next) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Stycation | Category",
        page: "Category",
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Success add category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Success update category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash("alertMessage", "Success delete category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  // Bank CRUD
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/bank/view_bank", {
        bank,
        alert,
        page: "Bank",
        title: "Stycation | Bank",
      });
    } catch (error) {
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { name, nameBank, nomorRekening } = req.body;
      const imageUrl = `images/${req.file.filename}`;
      await Bank.create({ name, nameBank, nomorRekening, imageUrl });
      req.flash("alertMessage", "Success add bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file === undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash("alertMessage", "Success update bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        removeImage(bank.imageUrl);
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Success update bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      removeImage(bank.imageUrl);
      await bank.remove();
      req.flash("alertMessage", "Success delete Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  // item CRUD
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const category = await Category.find();
      res.render("admin/item/view_item", {
        page: "Item",
        title: "Stycation | Item",
        category,
        alert,
        item,
        action: "view",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  addItem: async (req, res) => {
    try {
      const { categoryId, title, city, price, description } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description,
          price,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
      }
      req.flash("alertMessage", "Success add Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.find().findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const feature = await Feature.find({ itemId: id });
      const activity = await Activity.find({ itemId: id });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/item/view_item", {
        page: "Item",
        title: "Stycation | Show Image Item",
        item,
        alert,
        action: "show image",
        feature,
        activity,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.find()
        .findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({
          path: "categoryId",
          select: "id name",
        });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("admin/item/view_item", {
        page: "Item",
        title: "Stycation | Edit Item",
        item,
        alert,
        category,
        action: "edit",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, city, price, description } = req.body;
      const item = await Item.find()
        .findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({
          path: "categoryId",
          select: "id name",
        });
      const categorys = await Category.findOne({ _id: categoryId });

      // jika ada file yg diupload jalankan fungsi ini
      if (req.files.length > 0) {
        // Fungis Untuk ngeset Images berdasarkan id menjadi kosong dan array object imageId di Item menjadi kosong
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({
            _id: item.imageId[i].id,
          });
          removeImage(imageUpdate.imageUrl);
          await imageUpdate.remove();
        }
        await item.imageId.splice(0, item.imageId.length);

        // Setelah kosong tambah ulang sesuai image yg diupload
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        // Set category Menjadi Kosong berdasarkan id
        const category = await Category.findOne({
          _id: item.categoryId,
        });
        await category.itemId.splice(category.itemId.indexOf(item._id), 1);
        await category.save();
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = description;
        item.categoryId = categoryId;
        await item.save();
      } else {
        // Set category Menjadi Kosong berdasarkan id
        const category = await Category.findOne({
          _id: item.categoryId,
        });
        await category.itemId.splice(category.itemId.indexOf(item._id), 1);
        await category.save();

        item.title = title;
        item.price = price;
        item.city = city;
        item.description = description;
        item.categoryId = categoryId;
        await item.save();
      }
      categorys.itemId.push({ _id: item._id });
      await categorys.save();
      req.flash("alertMessage", "Success update item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.find()
        .findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({
          path: "categoryId",
          select: "id name",
        })
        .populate("featureId")
        .populate("activityId");
      for (let i = 0; i < item.imageId.length; i++) {
        const imageUpdate = await Image.findOne({
          _id: item.imageId[i].id,
        });
        removeImage(imageUpdate.imageUrl);
        await imageUpdate.remove();
      }

      // Set category Menjadi Kosong berdasarkan id
      const category = await Category.findOne({
        _id: item.categoryId,
      });
      // await category.itemId.splice(category.itemId.indexOf(item._id), 1);
      await category.itemId.pull({ _id: item._id });
      await category.save();

      for (let i = 0; i < item.featureId.length; i++) {
        const feature = await Feature.findOne({ _id: item.featureId[i]._id });
        removeImage(feature.imageUrl);
        await feature.remove();
      }
      for (let i = 0; i < item.activityId.length; i++) {
        const activity = await Activity.findOne({
          _id: item.activityId[i]._id,
        });
        removeImage(activity.imageUrl);
        await activity.remove();
      }
      await item.remove();
      req.flash("alertMessage", "Success delete Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  ViewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      // Tampilkan feature berdasarkan item id di Parameter
      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });
      res.render("admin/item/detail_item/view_detail_item", {
        page: "Item",
        title: "Stycation | Detail Item",
        alert,
        itemId,
        feature,
        activity,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  // CRUD FEATURE
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      const imageUrl = `images/${req.file.filename}`;
      if (!req.file) {
        req.flash("alertMessage", "Image not found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        const feature = await Feature.create({ name, qty, itemId, imageUrl });
        const item = await Item.findOne({ _id: itemId });
        item.featureId.push({ _id: feature._id });
        await item.save();
        req.flash("alertMessage", "Success add feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file === undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMessage", "Success update feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        if (req.file.size > 1 * 1024 * 1024) {
          removeImage(`images/${req.file.filename}`);
          req.flash("alertMessage", "Worng Image Size");
          req.flash("alertStatus", "danger");
          res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } else {
          removeImage(feature.imageUrl);
          feature.name = name;
          feature.qty = qty;
          feature.imageUrl = `images/${req.file.filename}`;
          await feature.save();
          req.flash("alertMessage", "Success update feature");
          req.flash("alertStatus", "success");
          res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("featureId");
      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          await item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      removeImage(feature.imageUrl);
      await feature.remove();
      req.flash("alertMessage", "Success delete Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  // CRUD ACTIVITY
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    const imageUrl = `images/${req.file.filename}`;
    try {
      if (!req.file) {
        req.flash("alertMessage", "Image not found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        if (req.file.size > 1 * 1024 * 1024) {
          removeImage(`images/${req.file.filename}`);
          req.flash("alertMessage", "Worng Image Size");
          req.flash("alertStatus", "danger");
          res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } else {
          const activity = await Activity.create({
            name,
            type,
            itemId,
            imageUrl,
          });
          const item = await Item.findOne({ _id: itemId });
          item.activityId.push({ _id: activity._id });
          await item.save();
          req.flash("alertMessage", "Success add activity");
          req.flash("alertStatus", "success");
          res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking", {
      page: "Booking",
      title: "Stycation | Booking",
    });
  },
};
