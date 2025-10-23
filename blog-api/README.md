# Blog API

A simple REST API for managing blog posts built with Node.js and Express.

## Table of Contents
- [Features](#features)
- [How It Works](#how-it-works)
  - [API Workflow](#api-workflow)
- [Code Implementation](#code-implementation)
  - [Data Storage](#data-storage)
  - [Get All Posts (`getAllPosts`)](#get-all-posts-getallposts)
  - [Create Post (`createPost`)](#create-post-createpost)
  - [Get Post By ID (`getPostById`)](#get-post-by-id-getpostbyid)
  - [Update Post (`updatePost`)](#update-post-updatepost)
  - [Delete Post (`deletePost`)](#delete-post-deletepost)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Post Schema](#post-schema)
- [Response Format](#response-format)

## Features
- In-memory storage (no database required)
- CRUD operations for blog posts
- Basic validation
- JSON API responses

## How It Works

This API provides a straightforward way to manage blog posts. Since it uses in-memory storage, all data will be reset when the server restarts.

### API Workflow

Here’s a typical workflow for managing posts:

#### 1. Create a New Post

First, you can create a new post by sending a `POST` request with the post's title, content, and author.

**Request:**
- `POST /posts`

**Example using `curl`:**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"This is the content of my first post.","author":"John Doe"}'
```

#### 2. Get All Posts

You can retrieve all the posts that have been created.

**Request:**
- `GET /posts`

**Example using `curl`:**
```bash
curl http://localhost:3000/posts
```

#### 3. Update a Post

You can update an existing post by its ID.

**Request:**
- `PUT /posts/:id`

**Example using `curl`:**
```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Post Title","content":"Updated content.","author":"John Doe"}'
```

#### 4. Delete a Post

You can delete a post by its ID.

**Request:**
- `DELETE /posts/:id`

**Example using `curl`:**
```bash
curl -X DELETE http://localhost:3000/posts/1
```

## Code Implementation

The core logic for handling blog posts is located in `src/controllers/post.controller.js`. The API uses a simple in-memory array to store data, which means all posts are cleared when the server restarts.

### Data Storage
A local array `posts` holds the collection of post objects, and `nextId` ensures each new post gets a unique ID.
```D:/express-api-collection/blog-api/src/controllers/post.controller.js#L1-2
let posts = [];
let nextId = 1;
```

### Get All Posts (`getAllPosts`)
This function simply returns the entire `posts` array, wrapped in a standard success response.
```D:/express-api-collection/blog-api/src/controllers/post.controller.js#L4-6
export const getAllPosts = (req, res) => {
  res.json({ success: true, data: posts });
};
```

### Create Post (`createPost`)
This function extracts the `title`, `content`, and `author` from the request body. It performs a basic validation check, creates a `newPost` object with a unique ID, and adds it to the `posts` array.
```D:/express-api-collection/blog-api/src/controllers/post.controller.js#L16-24
export const createPost = (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Title and content are required" });
  }
  const newPost = { id: nextId++, title, content, author: author || "Anonymous" };
  posts.push(newPost);
  res.status(201).json({ success: true, data: newPost });
};
```

### Get Post By ID (`getPostById`)
This function finds a post by its `id` using the `find` method on the array. If no post is found, it returns a `404 Not Found` error.
```D:/express-api-collection/blog-api/src/controllers/post.controller.js#L8-14
export const getPostById = (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  res.json({ success: true, data: post });
};
```

### Update Post (`updatePost`)
To update a post, the function first finds the index of the post in the array. If found, it updates the post object with the new data from the request body.
```D:/express-api-collection/blog-api/src/controllers/post.controller.js#L26-37
export const updatePost = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, author } = req.body;
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Title and content are required" });
  }
  posts[postIndex] = { ...posts[postIndex], title, content, author: author || posts[postIndex].author };
  res.json({ success: true, data: posts[postIndex] });
};
```

### Delete Post (`deletePost`)
This function finds the index of the post to be deleted and uses `splice` to remove it from the `posts` array.
```D:/express-api-collection/blog-api/src/controllers/post.controller.js#L39-46
export const deletePost = (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  posts.splice(postIndex, 1);
  res.json({ success: true, message: "Post deleted successfully" });
};
```

## Installation
```bash
npm install
```

## Usage
```bash
npm run dev
```

Server runs on http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /posts | Get all posts |
| GET | /posts/:id | Get single post |
| POST | /posts | Create new post |
| PUT | /posts/:id | Update post |
| DELETE | /posts/:id | Delete post |

## Post Schema
```json
{
  "id": 1,
  "title": "Post Title",
  "content": "Post content...",
  "author": "Author Name"
}
```

## Response Format
Success: `{ "success": true, "data": ... }`
Error: `{ "success": false, "message": "..." }`
