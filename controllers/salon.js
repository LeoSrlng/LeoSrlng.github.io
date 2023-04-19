SalonController = (req, res) => {
	let NumSalon = req.params.id;
	res.render("salon.ejs", { NumSalon });
};
