# Social Media Clone Project

A Facebook-inspired social media web application built with vanilla JavaScript, HTML, and CSS. The project simulates core social media features such as user authentication, posting, commenting, and profile management, using a local JSON server as a mock backend.

## Features

- **User Authentication**: Sign up, log in, and log out functionality with localStorage for session management.
- **Home Feed**: View all posts from all users, sorted by newest first.
- **Create Post**: Authenticated users can create new posts.
- **Commenting**: Users can comment on posts. Comments display the correct user name and image.
- **Profile Dropdown**: Click the profile image in the navbar to access a dropdown menu with Profile, Settings, and Logout options.
- **Responsive UI**: Modern, Facebook-like interface with clean navigation and layout.
- **Chatbot**: Simple chatbot popup for user interaction.

## Project Structure

```
Socialmedia Clone Project/
├── assets/
│   ├── css/           # All CSS files (home.css, style.css, etc.)
│   ├── images/        # All image assets
│   ├── js/            # All JavaScript files (home.js, login.js, etc.)
├── pages/             # HTML pages (home.html, signup.html, post-details.html)
├── db.json            # Mock database for json-server
├── index.html         # Login page
├── package.json       # Project metadata and scripts
```

## Getting Started

## Usage
- **Sign Up**: Create a new account from the signup page.
- **Log In**: Use your credentials to log in.
- **Home Feed**: View, create, and comment on posts.
- **Profile Dropdown**: Click your profile image in the navbar for more options.
- **Log Out**: Use the dropdown menu to log out.

## Customization
- Update images in `assets/images/` for user profiles, posts, etc.
- Modify `db.json` to add or edit users, posts, and comments.
- Style the app by editing CSS files in `assets/css/`.

## Notes
- This project is for educational/demo purposes and does not include real authentication or persistent backend storage.
- All data is stored in `db.json` and managed by json-server.

## Summary of Relationships in db.json
| Entity  | Relationship | Related Entity |
| ------- | ------------ | -------------- |
| User    | has many     | Posts          |
| User    | has many     | Comments       |
| User    | has many     | Likes          |
| Post    | belongs to   | User           |
| Post    | has many     | Comments       |
| Post    | has many     | Likes          |
| Comment | belongs to   | User           |
| Comment | belongs to   | Post           |
| Like    | belongs to   | User           |
| Like    | belongs to   | Post           |
------------------------------------------
### Entity Relationship Diagram (ERD)
![Untitled (4)2](https://github.com/user-attachments/assets/b783a41a-92da-4c1a-9a19-299d1c25ca8a)

