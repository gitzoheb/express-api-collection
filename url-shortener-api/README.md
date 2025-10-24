# URL Shortener API

A professional URL shortener API built with Node.js, Express, and MongoDB. This project provides a simple and efficient way to shorten long URLs, with a clean and easy-to-use frontend interface.

## Features

-   **Shorten Long URLs**: Convert long, cumbersome URLs into short and manageable links.
-   **URL Redirection**: Automatically redirect short URLs to their original destination.
-   **Click Tracking**: Count the number of clicks on each short URL.
-   **RESTful API**: A well-documented API for developers to integrate into their own applications.
-   **Simple Frontend**: An intuitive HTML, CSS, and JavaScript frontend for easy interaction.

## Installation

1.  **Install dependencies:**

    ```bash
    npm install
    ```

## Environment Setup

### MongoDB

This project uses MongoDB as its database. You can use a local MongoDB instance or a cloud-based service like MongoDB Atlas.

-   **Local MongoDB**: Make sure you have MongoDB installed and running on your machine.
-   **MongoDB Atlas**: Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set up a new cluster.

### .env Configuration

Create a `.env` file in the root of the project and add the following environment variables. You can use the `.env.example` file as a template.

```
# Port for the server to run on
PORT=5000

# Your MongoDB connection URI
MONGO_URI=your_mongodb_connection_string


```

-   `PORT`: The port on which the Express server will run.
-   `MONGO_URI`: The connection string for your MongoDB database.


## Usage

### Running the Application

To run the application, use the following command. This will start the server in development mode with hot-reloading.

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default is 5000). You can also run the application without hot-reloading using `npm start`.

### Interacting with the Application

There are two ways to use the URL shortener:

1.  **Frontend Interface**: Open your web browser and navigate to `http://localhost:5000`. You can use the simple form to enter a long URL and get a shortened version.
2.  **API**: For programmatic use, you can interact directly with the REST API.

## API Workflow

This API is public and does not require authentication. You can directly start making requests to the available endpoints.

The primary workflow for using the URL Shortener API is as follows:

### 1. Shorten a Long URL

To shorten a long URL, you send a `POST` request to the `/shorten` endpoint with the URL you want to shorten in the request body.

#### Request

The request body must be a JSON object containing the `originalUrl`.

-   **Endpoint**: `POST /shorten`
-   **Headers**: `Content-Type: application/json`
-   **Body**:
    ```json
    {
      "originalUrl": "https://www.your-long-url.com/with/a/very/long/path"
    }
    ```

#### Examples

Here are examples of how to make the request using `curl` and JavaScript's `fetch`.

**curl**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"originalUrl": "https://www.your-long-url.com/with/a/very/long/path"}' http://localhost:5000/shorten
```

**JavaScript Fetch**

```javascript
async function shortenUrl(longUrl) {
  try {
    const response = await fetch('http://localhost:5000/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl: longUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Shortened URL:', data.shortUrl);
    return data;
  } catch (error) {
    console.error('Error shortening URL:', error);
  }
}

// Example usage:
shortenUrl('https://www.your-long-url.com/with/a/very/long/path');
```

#### Response

The API will respond with a JSON object containing the details of the shortened URL, including the `shortUrl`. The exact response depends on whether the URL has been shortened before. See the [API Endpoints](#api-endpoints) section for detailed response examples.

### 2. Use the Short URL

Once you have the `shortUrl`, you can use it in your browser or application. When a user accesses the short URL, the API will automatically redirect them to the original long URL.

For example, if you navigate to `http://localhost:5000/H1j2k3l4` (using the `shortId` from the response), you will be redirected to the original URL.

This redirection is handled by the `GET /:shortId` endpoint, which also tracks the number of clicks on the link.

## API Endpoints

### `POST /shorten`

Shortens a long URL.

-   **Request Body**:

    ```json
    {
      "originalUrl": "https://www.example.com/a-very-long-url-that-needs-to-be-shortened"
    }
    ```

-   **Success Response (201 Created)**:

    If the URL is new, it will be added to the database and the following response will be sent:

    ```json
    {
      "_id": "64c2a3b3f3b3f3b3f3b3f3b3",
      "originalUrl": "https://www.example.com/a-very-long-url-that-needs-to-be-shortened",
      "shortUrl": "http://localhost:5000/H1j2k3l4",
      "shortId": "H1j2k3l4",
      "clicks": 0,
      "createdAt": "2025-07-27T12:00:00.000Z",
      "updatedAt": "2025-07-27T12:00:00.000Z"
    }
    ```

-   **Success Response (200 OK)**:

    If the URL already exists in the database, the existing short URL will be returned:

    ```json
    {
      "_id": "64c2a3b3f3b3f3b3f3b3f3b3",
      "originalUrl": "https://www.example.com/a-very-long-url-that-needs-to-be-shortened",
      "shortUrl": "http://localhost:5000/H1j2k3l4",
      "shortId": "H1j2k3l4",
      "clicks": 5,
      "createdAt": "2025-07-27T12:00:00.000Z",
      "updatedAt": "2025-07-27T12:05:00.000Z"
    }
    ```

### `GET /:shortId`

Redirects a short URL to its original destination.

-   **URL Parameter**:
    -   `shortId`: The unique ID of the short URL.

-   **Example**:

    `GET http://localhost:5000/H1j2k3l4`

-   **Response**:

    A `302 Found` redirect to the original URL.

-   **Error Response (404 Not Found)**:

    If the `shortId` is not found in the database:

    ```json
    {
      "message": "No URL found"
    }
    ```

## Developer Notes

-   **Code Structure**: The project follows a standard Express application structure, with code organized into `src` directory (containing `config`, `controllers`, `middleware`, `models`, `routes`), and a separate `public` directory.
-   **ES Modules**: The project uses ES Modules (`import`/`export`) syntax.
-   **Error Handling**: A central error handling middleware is used to catch and handle errors.
-   **Dependencies**: Key dependencies include `express`, `mongoose`, `cors`, `dotenv`, and `nanoid`.
-   **Customization**: You can customize the length of the short ID by modifying the `generateShortId.js` utility.
