const express = require("express");
const userController = require("../../controller/user.controller");

const router = express.Router();

router.route("/user").post(userController.createUser).get();
router.post("/user/login", userController.logIn);
router.get("/users", userController.getUsers);

module.exports = router;
