# E-social

# Social Network

Welcome to my E-Social project!

## Features

### User Registration & Authentication
- **User Registration**: API to register users with details such as username, email, and password.
- **User Authentication**: Supports JWT-based or session-based authentication for secure user login.

### Friend Request Functionality
- **Send Friend Requests**: API to send friend requests to other users.
- **Receive Friend Requests**: API to view incoming friend requests.
- **Accept/Reject Friend Requests**: APIs to accept or reject received friend requests.
- **Existing Friends Check**: Prevents sending friend requests to users who are already friends.

### Post Creation & Comments
- **Create Posts**: API for users to create text-only posts.
- **Add Comments**: API to allow users to comment on posts.

### Feed API
- **Friend Feed**: API that retrieves posts from a user’s friends.
- **Non-Friend Posts with Comments**: API that retrieves posts from non-friends if a friend has commented on them.

### Bonus Features
- **Like Functionality**: Ability to like posts.
- **Frontend Integration**: A React and Next.js frontend to interact with the API.

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- React.js
- Express.js

### API Endpoints

- **User Registration**: `POST /api/v1/auth/register`
- **User Login**: `POST /api/v1/auth/login`
- **User Details**: `GET /api/v1/auth/userDetails`
- **All Users**: `GET /api/v1/auth/allusers`
- **Send Friend Request**: `POST /api/v1/friend-request/sendRequest/receiverId`
- **Accept Friend Request**: `POST /api/v1/friend-request/requestId/:status`
- **All Requests**: `GET /api/v1/friend-request/requests`
- **Create Post**: `POST /api/v1/post/createPost`
- **Feed Post**: `GET /api/v1/post/feed`
- **Add Comment**: `POST /api/v1/post/:postId/comments`
- **Add Like**: `POST /api/v1/post/:postId/likes`
  
