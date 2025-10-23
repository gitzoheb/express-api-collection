
# File Upload API with Node.js, Express, and Multer

This project is a simple and functional File Upload API built with Node.js, Express, and Multer. It provides an endpoint for uploading single image files, with basic file type validation and a static frontend for interaction.

## Features

- **File Upload:** Upload single image files (`.jpg`, `.jpeg`, `.png`).
- **File Storage:** Uploaded files are stored in the `src/uploads` directory.
- **API Response:** The API responds with JSON data containing the uploaded file's name, path, and size.
- **File Type Validation:** Basic validation to ensure only image files are uploaded.
- **Static Frontend:** A simple HTML frontend to interact with the API.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/file-upload-api.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd file-upload-api
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

### Running the Application

1. **Start the server:**

   ```bash
   npm start
   ```

2. **Access the application:**

   Open your web browser and navigate to `http://localhost:3000`. You will see a simple file upload interface.

## How It Works

### Folder Structure

The project follows a clear and organized folder structure:

```
file-upload-api/
├── src/
│   ├── controllers/
│   │   └── uploadController.js  // Handles file upload logic
│   ├── public/                  // Contains the static frontend
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── routes/
│   │   └── uploadRoutes.js      // Defines the API routes
│   ├── uploads/                 // Stores uploaded files
│   └── index.js                 // Main entry point of the application
├── .gitignore
├── package.json
└── README.md
```

### Backend

- **`src/index.js`:** This is the main entry point of the application. It sets up the Express server, defines the port, and configures the middleware. It also serves the static files from the `src/public` directory and uses the API routes defined in `src/routes/uploadRoutes.js`.

- **`src/routes/uploadRoutes.js`:** This file defines the API routes for file uploads. It imports the `uploadFile` controller and associates it with the `POST /upload` route.

- **`src/controllers/uploadController.js`:** This is where the core file upload logic resides. It uses the `multer` library to handle `multipart/form-data`, which is used for uploading files. Here's a breakdown of the key components:

  - **`storage`:** This `multer` configuration determines where the uploaded files are stored. In this case, they are saved in the `src/uploads` directory with a unique filename generated using `Date.now()`.

  - **`fileFilter`:** This function provides basic validation to ensure that only files with `.jpg`, `.jpeg`, or `.png` extensions are uploaded. If an invalid file type is detected, an error is returned.

  - **`upload`:** This initializes `multer` with the defined `storage` and `fileFilter`. It also sets a file size limit of 5MB.

  - **`uploadFile`:** This is the main controller function that handles the file upload request. It uses the `upload` middleware to process the file and then sends a JSON response containing the file's details.

### Frontend

- **`src/public/index.html`:** This is the main HTML file that provides the structure for the file upload interface. It includes a form with a file input and a button to trigger the upload.

- **`src/public/style.css`:** This file contains the basic styling for the frontend, making it more visually appealing.

- **`src/public/script.js`:** This file handles the client-side logic for the file upload. It listens for the form submission, creates a `FormData` object, and sends a `POST` request to the `/api/upload` endpoint using the `fetch` API. It then displays the server's response to the user.

## API Usage

### `POST /api/upload`

This endpoint is used to upload a single image file.

- **Request:**

  - **Method:** `POST`
  - **Headers:** `Content-Type: multipart/form-data`
  - **Body:** The request body should contain a single file with the field name `image`.

- **Response:**

  - **Success (200):**

    ```json
    {
      "fileName": "1679543210987.png",
      "filePath": "src/uploads/1679543210987.png",
      "fileSize": 12345
    }
    ```

  - **Error (400):**

    ```json
    {
      "message": "Error: Images Only!"
    }
    ```

## Conclusion

This project serves as a great starting point for understanding how to build a file upload API with Node.js and Express. By following the code and the explanations in this README, you should have a solid understanding of how the different parts of the application work together.
