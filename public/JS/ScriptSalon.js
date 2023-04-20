var socket = io();

var messages = document.getElementById("messages");
var formChat = document.getElementById("formChat");
var inputChat = document.getElementById("inputChat");

var formLogin = document.getElementById("formLogin");
var inputLogin = document.getElementById("inputLogin");
var hidderBody = document.getElementById("hidderBody");

// const scrollToBottom = () => {
// 	if (window.scrollTop() + window.height() + 2 * messages.childNodes.last().outerHeight() >= document.height()) {
// 		hidderBody.animate({ scrollTop: document.height() }, 0);
// 	}
// };  ////////////////////////////TODO////////////////////////////////////

formLogin.addEventListener("submit", (e) => {
	e.preventDefault();
	let user = {
		username: inputLogin.value.trim(),
	};
	if (user.username.length !== 0) {
		socket.emit("user-login", user);
		inputLogin.value = "";
		hidderBody.removeAttribute("class");
		inputChat.focus();
	}
});

formChat.addEventListener("submit", (e) => {
	e.preventDefault();
	let message = {
		text: inputChat.value.trim(),
	};
	if (message.text.length !== 0) {
		socket.emit("chat message", message);
		inputChat.value = "";
	}
});

socket.on("chat message", (msg) => {
	let resContainer = document.createElement("li");

	let user = document.createElement("span");
	user.className = "username";
	user.textContent = msg.username + " :  ";

	let text = document.createElement("span");
	text.textContent = msg.text;

	let result = document.createElement("div");
	result.appendChild(user);
	result.appendChild(text);

	messages.appendChild(resContainer);
	resContainer.appendChild(result);

	window.scrollTo(0, document.body.scrollHeight);
});

socket.on("service-message", (msg) => {
	let resContainer = document.createElement("li");
	resContainer.className = msg.type;
	console.log(resContainer);

	let reponse = document.createElement("span");
	reponse.className = "info";
	reponse.textContent = msg.text;
	console.log(reponse);

	resContainer.appendChild(reponse);
	messages.appendChild(resContainer);
	console.log(messages);
});
