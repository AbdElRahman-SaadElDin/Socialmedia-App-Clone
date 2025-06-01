// Get postId from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");

const container = document.getElementById("post-details-container");
const userImg = document.getElementById("post-user-img");
const userName = document.getElementById("post-user-name");
const postBody = document.getElementById("post-body");
const postLikes = document.getElementById("post-likes");
const postComments = document.getElementById("post-comments");
const commentsList = document.getElementById("comments-list");
const postTime = document.getElementById("post-time");

async function renderPostDetails() {
	if (!postId) {
		container.innerHTML = "<p>Post not found.</p>";
		return;
	}
	// Fetch post
	const postRes = await fetch(`http://localhost:3000/posts/${postId}`);
	if (!postRes.ok) {
		container.innerHTML = "<p>Post not found.</p>";
		return;
	}
	const post = await postRes.json();
	// Fetch user
	const userRes = await fetch(`http://localhost:3000/users/${post.userId}`);
	const user = userRes.ok ? await userRes.json() : { fullName: "Anonymous", image: "../../assets/images/profile.jpg" };
	// Fetch comments
	const commentsRes = await fetch(`http://localhost:3000/comments?postId=${postId}`);
	const comments = commentsRes.ok ? await commentsRes.json() : [];

	userImg.src = "../../assets/images/profile.jpg" || user.image;
	userName.textContent = user.fullName;
	postBody.textContent = post.postBody;
	postLikes.textContent = `${post.likesNumber} Likes`;
	postComments.textContent = `${post.commentsNumber} Comments`;

	// Add time under the name
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

	postTime.textContent = getTimeAgo(post.date);

	if (comments.length === 0) {
		commentsList.innerHTML = "<p>No comments yet.</p>";
	} else {
		// Fetch all users for comments
		const usersRes = await fetch("http://localhost:3000/users");
		const usersArr = usersRes.ok ? await usersRes.json() : [];
		commentsList.innerHTML = comments
			.map((c) => {
				const commentUser = usersArr.find((u) => u.id == c.userId) || {
					fullName: "Anonymous",
					image: "../../assets/images/profile.jpg",
				};
				return `
            <div class="comment-item">
                <img src="${"../../assets/images/profile.jpg" || commentUser.image}" class="user-img"/>
                <span class="comment-user">${commentUser.fullName}</span>
                <span class="comment-body">${c.commentBody}</span>
            </div>
            `;
			})
			.join("");
	}
}

renderPostDetails();
