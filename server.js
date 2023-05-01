const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const router = require("./Routes/router.js");

app.use("/", router);

app.use(express.static("public"));

let users = [];
let messages = [];
let typingUsers = [];

io.on("connection", (socket) => {
	console.log("Un utilisateur débarque");
	let loggedUser;

	socket.on("user-login", (user, callback) => {
		let err = "Le nom d'utilisateur \"" + user.username + '" est déja utilisé';
		let userIndex = -1;
		for (i = 0; i < users.length; i++) {
			if (users[i].username === user.username) {
				userIndex = i;
			}
		}
		if (user !== undefined && userIndex === -1) {
			loggedUser = user;
			users.push(loggedUser);
			let userServiceMessage = {
				text: loggedUser.username + " est de retour, pour vous jouer un mauvais tour",
				type: "login",
			};
			let broadcastedServiceMessage = {
				text: loggedUser.username + " est de retour, pour vous jouer un mauvais tour",
				type: "login",
			};
			socket.emit("service-message", userServiceMessage);
			socket.broadcast.emit("service-message", broadcastedServiceMessage);
			messages.push(broadcastedServiceMessage);
			for (ii = 0; ii < users.length; ii++) {
				io.emit("user-login", users[ii]);
			}
			callback(true);
			console.log(loggedUser.username + " est de retour, pour vous jouer un mauvais tour");
		} else {
			socket.emit("err-log", err);
			callback(false);
		}
	});

	for (iii = 0; iii < messages.length; iii++) {
		if (messages[iii].username !== undefined) {
			socket.emit("chat message", messages[iii]);
		} else {
			socket.emit("service-message", messages[iii]);
		}
	}

	socket.on("start-typing", () => {
		if (typingUsers.indexOf(loggedUser) === -1) {
			typingUsers.push(loggedUser);
		}
		console.log(typingUsers);
		io.emit("update-typing", typingUsers);
	});

	socket.on("stop-typing", () => {
		let typingUserIndex = typingUsers.indexOf(loggedUser);
		if (typingUserIndex !== -1) {
			typingUsers.splice(typingUserIndex, 1);
		}
		console.log(typingUsers);
		io.emit("update-typing", typingUsers);
	});

	socket.on("chat message", (msg) => {
		msg.username = loggedUser.username;
		io.emit("chat message", msg);
		messages.push(msg);
		if (messages.length > 150) {
			messages.splice(0, 1);
		}
	});

	socket.on("disconnect", () => {
		if (loggedUser !== undefined) {
			let serviceMessage = {
				text: "Une fois de plus " + loggedUser.username + " s'envole vers d'autres cieux",
				type: "logout",
			};
			let typingUserIndex = typingUsers.indexOf(loggedUser);
			if (typingUserIndex !== -1) {
				typingUsers.splice(typingUserIndex, 1);
			}
			socket.broadcast.emit("service-message", serviceMessage);
			let userIndex = users.indexOf(loggedUser);
			if (userIndex !== -1) {
				users.splice(userIndex, 1);
			}
			messages.push(serviceMessage);
			io.emit("user-logout", loggedUser);
			console.log("Une fois de plus " + loggedUser.username + " s'envole vers d'autres cieux");
		}
	});
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});
