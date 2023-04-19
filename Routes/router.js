const express = require("express");
// const HomeController = require("../controllers/home.js");
// const SalonController = require("../controllers/salon.js");

const router = express.Router();

// router.use(function num(req, res, next) {
// 	let NumSalon = Math.floor(Math.random() * 9999);
// 	res.locals.NumSalon = NumSalon;
// 	next();
// });

router.get(
	"/",
	(HomeController = (req, res) => {
		res.render("home.ejs");
	})
);

router.get(
	"/salon",
	(SalonController = (req, res) => {
		let NumSalon = req.params.id;
		res.render("salon.ejs", { NumSalon });
	})
);

// router.get("/page2", function (req, res) {
// 	res.send("ici la future page2");
// });

// router.get("/page3", function (req, res) {
// 	res.send("ici la future page3");
// });

module.exports = router;
