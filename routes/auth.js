const router = require("express").Router();
const loginController = require("../controllers/loginController");
const auth = require("../middlewares/auth");

router.get("/", loginController.viewLogin);
router.get("/login", loginController.viewLogin);
router.post("/login", loginController.actionLogin);
router.get("/logout", loginController.actionLogout);
router.use(auth);

module.exports = router;
