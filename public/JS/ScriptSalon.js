const socket = io();

const hidderBody = document.getElementById("hidderBody");

const messages = document.getElementById("messages");
const formChat = document.getElementById("formChat");
const inputChat = document.getElementById("inputChat");
const users = document.getElementById("users");

const formLogin = document.getElementById("formLogin");
const inputLogin = document.getElementById("inputLogin");
const loginPage = document.getElementById("Login");

let typingTimer;
let isTyping = false;
let spanTyping;

formLogin.addEventListener("submit", (e) => {
	e.preventDefault();
	let user = {
		username: inputLogin.value.trim(),
	};
	if (user.username.length > 0) {
		socket.emit("user-login", user, (success) => {
			if (success) {
				inputLogin.value = "";
				hidderBody.removeAttribute("class");
				inputChat.focus();
			}
		});
	}
});

socket.on("err-log", (err) => {
	let reponse = document.createElement("p");
	reponse.className = "err-msg";
	reponse.textContent = err;

	loginPage.appendChild(reponse);

	scrollToBottom();
});

socket.on("user-login", (user) => {
	let nbrUser = users.childNodes.length;
	let aUser = document.createElement("li");
	aUser.className = user.username + " new";
	aUser.textContent = user.username;

	spanTyping = document.createElement("span");
	spanTyping.className = "typing";
	spanTyping.textContent = " ...est en train d'écrire";

	users.appendChild(aUser);
	aUser.appendChild(spanTyping);
	spanTyping.hidden = true;

	setTimeout(() => {
		if (aUser.classList.contains("new")) {
			aUser.classList.remove("new");
		}
	}, 1250);
	if (users.firstChild.className.includes(user.username) && nbrUser > 0) {
		let toRemove = document.querySelector("li." + user.username);
		toRemove.remove();
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

	scrollToBottom();
});

inputChat.onkeydown = () => {
	clearTimeout(typingTimer);
	if (!isTyping) {
		socket.emit("start-typing");
		isTyping = true;
	}
};

inputChat.onkeyup = () => {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(() => {
		if (isTyping) {
			socket.emit("stop-typing");
			isTyping = false;
		}
	}, 750);
};

socket.on("update-typing", (typingUsers) => {
	console.log(typingUsers);
	// let toHide = document.querySelector("span.typing");
	spanTyping.hidden = true;
	// console.log(toHide);
	for (index = 0; index < typingUsers.length; index++) {
		let toShow = document.querySelector("li." + typingUsers[index].username + " span.typing");
		toShow.hidden = false;
		console.log("je passe ici");
	}
	// console.log(toShow);
});

socket.on("service-message", (msg) => {
	let resContainer = document.createElement("li");
	resContainer.className = msg.type;

	let reponse = document.createElement("span");
	reponse.className = "info";
	reponse.textContent = msg.text;

	resContainer.appendChild(reponse);
	messages.appendChild(resContainer);

	scrollToBottom();
});

const scrollToBottom = () => {
	let lastLi = messages.lastChild;
	if (window.scrollY + window.innerHeight + lastLi.offsetHeight >= document.body.offsetHeight) {
		window.scrollTo(0, document.body.scrollHeight);
	}
};

socket.on("user-logout", (user) => {
	let selector = document.querySelector("li." + user.username);
	selector.remove();
});
