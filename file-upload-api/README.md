# File Upload API

This document provides a comprehensive overview of the File Upload API, designed to help developers understand its functionality and how to integrate with it.

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [API Endpoint](#api-endpoint)
    -   [POST /upload](#post-upload)
-   [How It Works](#how-it-works)
-   [Getting Started](#getting-started)

## Overview

The File Upload API is a simple Express.js-based service that allows users to upload image files. It handles multipart/form-data requests, validates files, and saves them to the server's file system.

## Features

-   **File Upload:** Supports image file uploads via a RESTful endpoint.
-   **File Type Validation:** Restricts uploads to specific image formats (`jpeg`, `jpg`, `png`).
-   **File Size Limit:** Enforces a maximum file size of 5MB.
-   **Persistent Storage:** Saves uploaded files directly to the `src/uploads/` directory.
-   **Descriptive Responses:** Returns clear JSON responses for both successful uploads and errors.

## API Endpoint

The API exposes a single endpoint for handling file uploads.

### POST /upload

This endpoint processes the file upload. The request must be `multipart/form-data`.

-   **URL:** `/upload`
-   **Method:** `POST`
-   **Body:** `multipart/form-data`
    -   **key**: `image`
    -   **value**: The image file you want to upload.

#### Successful Response

-   **Status Code:** `200 OK`
-   **Content:** A JSON object containing details of the uploaded file.

**Example Response:**

```json
{
  "fileName": "1678886400000.png",
  "filePath": "src\\uploads\\1678886400000.png",
  "fileSize": 102400
}
```

#### Error Responses

-   **Status Code:** `400 Bad Request`

**Possible Error Messages:**

-   If no file is selected:
    ```json
    {
      "message": "No file selected!"
    }
    ```
-   If the file type is not an image (`jpeg`, `jpg`, `png`):
    ```json
    {
      "message": "Error: Images Only!"
    }
    ```
-   If the file size exceeds the 5MB limit:
    ```json
    {
      "message": "File too large"
    }
    ```

## How It Works

The API is built with **Express.js** and uses the **`multer`** middleware to handle file uploads.

1.  **Request Handling:** When a `POST` request hits the `/upload` endpoint, the `multer` middleware intercepts it.
2.  **Storage Engine (`multer.diskStorage`):**
    -   **Destination:** It's configured to save all incoming files to the `src/uploads/` directory on the server.
    -   **Filename:** To prevent name collisions, each file is renamed using the current timestamp followed by its original extension (e.g., `1678886400000.png`).
3.  **File Validation:**
    -   **File Filter:** A filter is in place to check both the file's MIME type and its extension. It only permits files with `.jpeg`, `.jpg`, or `.png` extensions and corresponding MIME types.
    -   **Size Limit:** `multer` is configured with a limit of 5MB. Any file larger than this will be rejected.
4.  **Controller Logic:**
    -   If the file passes validation, it is saved to the disk. The controller then sends a `200` response with the file's new name, path, and size.
    -   If an error occurs during the upload process (e.g., validation failure), the controller catches it and returns a `400` response with a descriptive error message.

## Getting Started

To run this API on your local machine, follow these steps:

1.  **Install Dependencies:**
    ```sh
    npm install
    ```
2.  **Start the Server:**
    ```sh
    npm start
    ```

The server will start, and you can begin sending requests to the `/upload` endpoint.