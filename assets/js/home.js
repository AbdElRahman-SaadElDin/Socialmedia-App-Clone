const commentInput = document.getElementById("comment-input");
const popupOverlay = document.getElementById("popup-overlay");
const popupCloseBtn = document.getElementById("popup-close");
const postInput = document.getElementById("post-input");
const submitBtn = document.getElementById("submit-btn");

// Redirect to signup if no user is found in localStorage
const userData = localStorage.getItem("user");
if (!userData) {
	window.location.href = "../index.html";
}
const user = JSON.parse(userData);

function getTimeAgo(dateString) {
	const now = new Date();
	const postDate = new Date(dateString);
	const diffInSeconds = Math.floor((now - postDate) / 1000);

	const intervals = [
		{ label: "year", seconds: 31536000 },
		{ label: "month", seconds: 2592000 },
		{ label: "day", seconds: 86400 },
		{ label: "h", seconds: 3600 },
		{ label: "m", seconds: 60 },
		{ label: "s", seconds: 1 },
	];

	for (const interval of intervals) {
		const count = Math.floor(diffInSeconds / interval.seconds);
		if (count >= 1) {
			return `${count} ${interval.label}`;
		}
	}

	return "just now";
}

if (userData) {
	const fullName = user.fullName;
	const firstName = user.firstName;

	commentInput.placeholder = `What's on your mind, ${firstName}?`;
	postInput.placeholder = `What's on your mind, ${firstName}?`;

	// Update the Name of the Login user
	document.querySelectorAll(".user-name").forEach((el) => {
		el.textContent = fullName;
	});
} else {
	console.warn("User not found in localStorage");
}

// Post popup form
commentInput.addEventListener("click", () => {
	popupOverlay.style.display = "flex";
});

popupCloseBtn.addEventListener("click", () => {
	popupOverlay.style.display = "none";
});

popupOverlay.addEventListener("click", (e) => {
	if (e.target === popupOverlay) {
		popupOverlay.style.display = "none";
	}
});

// Post creation in db.json
submitBtn.addEventListener("click", async function (e) {
	e.preventDefault();

	const postBody = postInput.value.trim();
	if (!postBody) {
		alert("Post cannot be empty!");
		return;
	}

	const postData = {
		date: new Date().toISOString(),
		userId: user.id,
		postBody: postBody,
		image: "https://example.com/image1.jpg",
		likesNumber: 0,
		commentsNumber: 0,
	};

	const response = await fetch("http://localhost:3000/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postData),
	});
	if (response.ok) {
		alert("Post successful!");
		popupOverlay.style.display = "none";
	} else {
		alert("Post failed.");
		popupOverlay.style.display = "none";
	}
});

fetch("http://localhost:3000/posts")
	.then((response) => response.json())
	.then(async (posts) => {
		// Sort posts by date descending
		posts.sort((a, b) => new Date(b.date) - new Date(a.date));
		// Fetch all users once to link each post with a user
		const usersResponse = await fetch("http://localhost:3000/users");
		const users = await usersResponse.json();

		const container = document.getElementById("posts-container");

		posts.forEach((post) => {
			const userForPost = users.find((u) => u.id == post.userId);
			const userName = userForPost ? userForPost.fullName : "Anonymous User";
			const userImage = userForPost && userForPost.image ? userForPost.image : "../../assets/images/profile.jpg";

			const postCard = document.createElement("div");
			postCard.setAttribute("data-id", post.id);
			postCard.className = "friends_post";
			postCard.innerHTML = `
        <div class="friend_post_top">
          <div class="img_and_name">
            <img class="user-img" src="../../assets/images/profile.jpg" />
            <div class="friends_name">
              <p class="friends_name user-name">${userName}</p>
              <p class="time">${getTimeAgo(post.date)}.<i class="fa-solid fa-user-group"></i></p>
            </div>
          </div>
          <div class="menu">
            <i class="fa-solid fa-ellipsis"></i>
          </div>
        </div>

        <p class="post-body">${post.postBody}</p>

        <div class="info">
          <div class="emoji_img">
            <img src="../../assets/images/like.png" />
            <img src="../../assets/images/haha.png" />
            <img src="../../assets/images/heart.png" />
            <p class="likes-num">${post.likesNumber} likes</p>
          </div>
          <div class="comment">
            <p class="comments-num">${post.commentsNumber} Comments</p>
            <p>1.3K Shares</p>
          </div>
        </div>

        <hr />

        <div class="like">
          <div class="like_icon">
            <i class="fa-solid fa-thumbs-up"></i>
            <p>Like</p>
          </div>
          <div class="like_icon comment-link" data-id="${post.id}">
            <i class="fa-solid fa-message"></i>
            <p>Comments</p>
          </div>
          <div class="like_icon">
            <i class="fa-solid fa-share"></i>
            <p>Share</p>
          </div>
        </div>

        <hr />

        <div class="comment_warpper">
          <img class="user-img" src="../../assets/images/profile.jpg" />
          <div class="circle"></div>
          <div class="comment_search">
            <input type="text" class="commenting-input" placeholder="Write a comment" />
            <i class="fa-regular fa-face-smile"></i>
            <i class="fa-solid fa-camera"></i>
            <i class="fa-regular fa-note-sticky"></i>
            <i class="fa-solid fa-paper-plane comment-btn" style="color: #0842fc;"></i>
          </div>
        </div>
      `;

			container.appendChild(postCard);

			// event listener on each post to handle comments
			const commentBtn = postCard.querySelector(".comment-btn");
			const commentInput = postCard.querySelector(".commenting-input");
			// event listener for opening post details on Comments click
			const commentLink = postCard.querySelector(".comment-link");
			if (commentLink) {
				commentLink.addEventListener("click", () => {
					window.location.href = `post-details.html?postId=${post.id}`;
				});
			}

			commentBtn.addEventListener("click", async () => {
				const commentText = commentInput.value.trim();
				if (!commentText) {
					alert("Comment cannot be empty!");
					return;
				}

				const postId = postCard.getAttribute("data-id");

				const commentData = {
					date: new Date().toISOString(),
					userId: user.id,
					postId: postId,
					commentBody: commentText,
					image: user.image || "https://example.com/image1.jpg",
				};

				try {
					const response = await fetch("http://localhost:3000/comments", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(commentData),
					});

					if (response.ok) {
						alert("Comment added!");
						commentInput.value = "";
						// Increment commentsNumber for the post
						const updateResponse = await fetch(`http://localhost:3000/posts/${postId}`, {
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ commentsNumber: (post.commentsNumber || 0) + 1 }),
						});
						if (!updateResponse.ok) {
							console.warn("Failed to increment commentsNumber for the post.");
						}
					} else {
						alert("Failed to post comment.");
					}
				} catch (error) {
					console.error("Error posting comment:", error);
				}
			});
		});
	})
	.catch((error) => console.error("Error loading posts:", error));
