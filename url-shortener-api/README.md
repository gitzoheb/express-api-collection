# URL Shortener API

A professional URL shortener API built with Node.js, Express, and MongoDB. This project provides a simple and efficient way to shorten long URLs, with a clean and easy-to-use frontend interface.

## Features

-   **Shorten Long URLs**: Convert long, cumbersome URLs into short and manageable links.
-   **URL Redirection**: Automatically redirect short URLs to their original destination.
-   **Click Tracking**: Count the number of clicks on each short URL.
-   **RESTful API**: A well-documented API for developers to integrate into their own applications.
-   **Simple Frontend**: An intuitive HTML, CSS, and JavaScript frontend for easy interaction.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/gitzoheb/url-shortener-api.git
    cd url-shortener-api
    ```

2.  **Install dependencies:**

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

### Frontend Usage

1.  Open your web browser and navigate to `http://localhost:5000`.
2.  Enter a long URL into the input field and click the "Shorten" button.
3.  The shortened URL will be displayed below the form. You can click on it to be redirected to the original URL.

### Backend Usage (API)

The API provides endpoints for shortening URLs and redirecting to the original URLs.

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

-   **Code Structure**: The project follows a standard Express application structure, with code organized into `config`, `controllers`, `middleware`, `models`, `public`, and `routes` directories.
-   **ES Modules**: The project uses ES Modules (`import`/`export`) syntax.
-   **Error Handling**: A central error handling middleware is used to catch and handle errors.
-   **Dependencies**: Key dependencies include `express`, `mongoose`, `cors`, `dotenv`, and `nanoid`.
-   **Customization**: You can customize the length of the short ID by modifying the `generateShortId.js` utility.
