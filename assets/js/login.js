document.getElementById("loginForm").addEventListener("submit", async function (e) {
	e.preventDefault();

	const loginUser = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	const response = await fetch("http://localhost:3000/users");
	const users = await response.json();

	const user = users.find(
		(l) => (l.email === loginUser || l.username === loginUser || l.phone === loginUser) && l.password === password
	);

	if (user) {
		localStorage.setItem("user", JSON.stringify(user));
		// localStorage.setItem("loggedUser", user.fullName);
		window.location.href = "pages/home.html";
	} else {
		alert("The username or password is not correct.");
	}
});
