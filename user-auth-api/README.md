# User Authentication API

This is a simple User Authentication API built with Node.js, Express, and MongoDB (Mongoose).

## Features

- User registration (name, email, password)
- Password hashing using bcryptjs
- User login with email and password
- JWT (JSON Web Token) generation upon login
- Protected route to get user profile

## Prerequisites

- Node.js
- MongoDB

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create a `.env` file** in the root directory and add the following environment variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

   Replace `your_mongodb_connection_string` with your actual MongoDB connection string and `your_jwt_secret` with a secret of your choice.

3. **Run the project:**

   - For development (with nodemon):

     ```bash
     npm run dev
     ```

   - For production:

     ```bash
     npm start
     ```

   The server will start on port 5000.

## API Endpoints

### Register a new user

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Note:** Only emails from Google (`gmail.com`), Yahoo (`yahoo.com`), and Microsoft (`outlook.com`, `hotmail.com`) are allowed for registration.
- **Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Example request (curl):**

  ```bash
  curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
  ```

### Login a user

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Example request (curl):**

  ```bash
  curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
  ```

### Get user profile

- **URL:** `/api/users/profile`
- **Method:** `GET`
- **Headers:**

  ```
  Authorization: Bearer <your_jwt_token>
  ```

- **Example request (curl):**

  ```bash
  curl -X GET http://localhost:5000/api/users/profile -H "Authorization: Bearer <your_jwt_token>"
  ```

## Usage

This API requires token-based authentication for accessing protected routes. After a user registers or logs in, they receive a JSON Web Token (JWT). This token must be included in the `Authorization` header of subsequent requests to protected endpoints.

## API Workflow

Here’s a typical workflow for a new user:

### 1. Register a New User

First, a user signs up with their name, email, and password.

**Request:**

- **`POST /api/users/register`**

**Example using `curl`:**

```bash
curl -X POST http://localhost:5000/api/users/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "securepassword123"
}'
```

**Example using JavaScript `fetch`:**

```javascript
async function registerUser() {
  const response = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'securepassword123',
    }),
  });

  const data = await response.json();
  console.log(data);
  // Save the token from data.token
  return data.token;
}
```

**Successful Response:**

The API will return the new user's information along with a JWT. This token should be stored securely on the client-side (e.g., in `localStorage` or a cookie).

```json
{
  "_id": "60d5f2b4a1b2c3d4e5f6g7h8",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Log In

Once registered, the user can log in using their email and password.

**Request:**

- **`POST /api/users/login`**

**Example using `curl`:**

```bash
curl -X POST http://localhost:5000/api/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "jane.doe@example.com",
  "password": "securepassword123"
}'
```

**Example using JavaScript `fetch`:**

```javascript
async function loginUser() {
  const response = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'jane.doe@example.com',
      password: 'securepassword123',
    }),
  });

  const data = await response.json();
  console.log(data);
  // Save the token from data.token
  return data.token;
}
```

**Successful Response:**

Similar to registration, the API returns the user's info and a new JWT.

```json
{
  "_id": "60d5f2b4a1b2c3d4e5f6g7h8",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Access Protected Routes

With the JWT, the user can now access protected routes like their profile page.

**Request:**

- **`GET /api/users/profile`**

To do this, include the token in the `Authorization` header with the `Bearer` scheme.

**Example using `curl`:**

```bash
# Replace <YOUR_JWT_TOKEN> with the actual token
curl -X GET http://localhost:5000/api/users/profile \
-H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Example using JavaScript `fetch`:**

```javascript
async function getProfile(token) {
  const response = await fetch('http://localhost:5000/api/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  return data;
}
```

**Successful Response:**

The API returns the user's profile information (excluding the password).

```json
{
  "_id": "60d5f2b4a1b2c3d4e5f6g7h8",
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

If the token is missing, expired, or invalid, the API will return a `401 Unauthorized` error.
