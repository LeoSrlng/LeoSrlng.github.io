HomeControGet = (req, res) => {
	res.render("home.ejs");
};

HomeControPost = (req, res) => {};

module.exports = { HomeControGet, HomeControPost };
