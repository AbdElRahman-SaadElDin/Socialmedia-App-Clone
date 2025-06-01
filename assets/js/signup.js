document.getElementById("signupForm").addEventListener("submit", async function (e) {
	e.preventDefault();

	const email = document.getElementById("email").value.trim();
	const username = document.getElementById("username").value.trim();
	const firstName = document.getElementById("firstName").value.trim();
	const lastName = document.getElementById("lastName").value.trim();
	const password = document.getElementById("password").value;
	const age = parseInt(document.getElementById("age").value);
	const dateOfBirth = document.getElementById("dateOfBirth").value;

	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		alert("Please enter a valid email address.");
		return false;
	}

	// Username validation: only lowercase letters, numbers, underscores, and dots
	const usernameRegex = /^[a-z0-9_.]+$/;
	if (!usernameRegex.test(username)) {
		alert("Username can only contain lowercase letters, numbers, underscores, and dots.");
		return false;
	}

	// First/Last Name validation: must be capitalized
	const nameRegex = /^[A-Z][a-z]*$/;
	if (!nameRegex.test(firstName)) {
		alert("First name must start with an uppercase letter and the rest lowercase.");
		return false;
	}
	if (!nameRegex.test(lastName)) {
		alert("Last name must start with an uppercase letter and the rest lowercase.");
		return false;
	}

	// Password validation: 8+ chars, upper, lower, number, special char
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
	if (!passwordRegex.test(password)) {
		alert("Password must be at least 8 characters and include upper, lower, number, and special character.");
		return false;
	}

	// Age validation: must be 16 or older
	if (isNaN(age) || age < 16) {
		alert("You must be at least 16 years old to sign up.");
		return false;
	}

	// Date of Birth validation: not in future, 16 or older
	if (dateOfBirth) {
		const dob = new Date(dateOfBirth);
		const now = new Date();
		if (dob > now) {
			alert("Date of birth cannot be in the future.");
			return false;
		}
		if (now.getFullYear - dob.getFullYear() >= 16) {
			alert("You must be at least 16 years old to sign up.");
			return false;
		}
	}

	const user = {
		firstName: firstName,
		lastName: lastName,
		fullName: `${firstName} ${lastName}`,
		email: email,
		username: username,
		phone: document.getElementById("phone").value,
		password: password,
		age: age,
		dateOfBirth: dateOfBirth,
		image: document.getElementById("image").value || "" ,
		date: new Date().toISOString(),
	};

	const response = await fetch("http://localhost:3000/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	});

	if (response.ok) {
		window.location.href = "../index.html";
	} else {
		alert("Signup failed.");
	}
	return false;
});
