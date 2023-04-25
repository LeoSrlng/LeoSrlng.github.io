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
	console.log("Un utilisateur débarque");
	let loggedUser;
	let users = [];

	socket.on("user-login", (user, callback) => {
		let userIndex = -1;
		for (i = 0; i < users.length; i++) {
			if (users[i].username === user.username) {
				userIndex = i;
			}
		}
		if (user !== undefined && userIndex === -1) {
			loggedUser = user;
			users = [...users, loggedUser];
			console.log(users);
			let userServiceMessage = {
				text: loggedUser.username + " s'est connecté",
				type: "login",
			};
			let broadcastedServiceMessage = {
				text: loggedUser.username + " s'est connecté",
				type: "login",
			};
			socket.emit("service-message", userServiceMessage);
			socket.broadcast.emit("service-message", broadcastedServiceMessage);
			console.log(users);
			for (ii = 0; ii < users.length; ii++) {
				io.emit("user-login", users[ii]);
			}
			callback(true);
		} else {
			callback(false);
		}
		console.log(loggedUser.username + " s'est connecter");
	});

	socket.on("chat message", (msg) => {
		msg.username = loggedUser.username;
		io.emit("chat message", msg);
		console.log(users);
	});

	socket.on("disconnect", () => {
		if (loggedUser !== undefined) {
			let serviceMessage = {
				text: loggedUser.username + " s'est déconnecter",
				type: "logout",
			};
			socket.broadcast.emit("service-message", serviceMessage);
			let userIndex = users.indexOf(loggedUser);
			if (userIndex !== -1) {
				users.splice(userIndex, 1);
			}
			io.emit("user-logout", loggedUser);
			console.log(loggedUser.username + " s'est déconnecter");
		}
	});
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});
