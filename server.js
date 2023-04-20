const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const router = require("./Routes/router.js");

app.use("/", router);

app.use(express.static("public"));

io.on("connection", (socket) => {
	console.log("Un utilisateur vient de se connecter");
	let loggedUser;

	socket.on("user-login", (user) => {
		loggedUser = user;
		if (loggedUser !== undefined) {
			let serviceMessage = {
				text: loggedUser.username + " c'est connecter",
				type: "login",
			};
			socket.broadcast.emit("service-message", serviceMessage);
			console.log(loggedUser.username + " c'est connecter");
		}
	});

	socket.on("chat message", (msg) => {
		msg.username = loggedUser.username;
		io.emit("chat message", msg);
		console.log(loggedUser.username + " dit: " + msg.text);
	});

	socket.on("disconnect", () => {
		if (loggedUser !== undefined) {
			let serviceMessage = {
				text: loggedUser.username + " c'est déconnecter",
				type: "logout",
			};
			socket.broadcast.emit("service-message", serviceMessage);
			console.log(loggedUser.username + " c'est déconnecter");
		}
	});
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});
