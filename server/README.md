# Blog API

A RESTful API for a blog application built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login) with JWT
- CRUD operations for blog posts
- Protected routes and user authorization
- Input validation
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/blog
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
```

4. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Routes

- `POST /api/users/register` - Register a new user

  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/users/login` - Login user

  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/users/profile` - Get user profile (Protected route)

### Post Routes

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post by ID
- `POST /api/posts` - Create a new post (Protected route)

  ```json
  {
    "title": "My First Post",
    "content": "This is the content of my first post"
  }
  ```

- `PUT /api/posts/:id` - Update post (Protected route)

  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```

- `DELETE /api/posts/:id` - Delete post (Protected route)

## Authentication

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Error Handling

The API includes comprehensive error handling for:

- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Server errors

## Testing with Postman

1. Import the provided Postman collection (if available)
2. Set up environment variables in Postman:

   - `BASE_URL`: https://pro-health-backend.vercel.app/
   - `TOKEN`: (will be automatically set after login)

3. Test the endpoints in the following order:
   - Register a new user
   - Login with the registered user
   - Create a new post
   - Get all posts
   - Get single post
   - Update post
   - Delete post

## License

MIT
