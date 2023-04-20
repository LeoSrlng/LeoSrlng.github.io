const express = require("express");
const { HomeControGet, HomeControPost } = require("../controllers/home.js");
const SalonController = require("../controllers/salon.js");

const router = express.Router();

router.use(function num(req, res, next) {
	let NumSalon = Math.floor(Math.random() * 9999);
	res.locals.NumSalon = NumSalon;
	next();
});

router.get("/", HomeControGet);
router.post("/", HomeControPost);

router.get("/salon/:id", SalonController);

module.exports = router;
