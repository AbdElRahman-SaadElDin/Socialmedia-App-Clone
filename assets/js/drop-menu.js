const profileFigure = document.getElementById("profile-figure");
const profileDropdown = document.getElementById("profile-dropdown");

profileFigure.addEventListener("click", function (e) {
	e.stopPropagation();
	profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
});
document.addEventListener("click", function () {
	profileDropdown.style.display = "none";
});

// Optional: handle logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
	logoutBtn.addEventListener("click", function (e) {
		e.preventDefault();
		localStorage.removeItem("user");
		window.location.href = "../index.html";
	});
}
