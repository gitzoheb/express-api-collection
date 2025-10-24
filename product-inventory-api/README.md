# Product Inventory API with Frontend

A simple and beginner-friendly Product Inventory management system built with Node.js, Express, and a static HTML/CSS/JavaScript frontend. This project demonstrates how to create a full-stack web application for managing products, including adding, viewing, updating, and deleting items.

## Features

- **Complete CRUD Operations**: Create, Read, Update, and Delete products
- **Product Filtering**: Filter products by category, price range, and search by name
- **Sorting**: Sort products by name or price in ascending or descending order
- **Pagination**: Handle large lists of products with page-based navigation
- **User-Friendly Frontend**: Web interface to interact with the API without coding
- **RESTful API**: Clean API endpoints that follow REST principles
- **Error Handling**: Proper error messages and status codes
- **Request Logging**: Logs all incoming requests for debugging
- **Environment Configuration**: Uses .env file for easy configuration

## How It Works

### Architecture Overview

This application uses a simple client-server architecture:

1. **Backend (API Server)**: Built with Node.js and Express
   - Handles HTTP requests from the frontend
   - Manages product data in memory (no database needed)
   - Provides REST API endpoints
   - Serves static frontend files

2. **Frontend (Static Website)**: HTML, CSS, and JavaScript
   - Displays products in a nice layout
   - Allows users to add, edit, and delete products
   - Communicates with the API using fetch requests

3. **Data Storage**: In-memory array (resets when server restarts)

### Data Flow

```
User Action → Frontend (HTML/JS) → API Request → Backend (Express) → Response → Frontend Update
```

## Technologies Used

- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web framework for building the API
- **UUID**: Generates unique IDs for products
- **Morgan**: HTTP request logger middleware
- **Dotenv**: Manages environment variables
- **HTML/CSS/JavaScript**: Frontend technologies (no frameworks needed)

## Installation

### Prerequisites

- Node.js (version 14 or higher) installed on your computer
- A code editor like VS Code

### Steps

1. **Clone or Download the Project**
   ```
   git clone <repository-url>
   cd product-inventory-api
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Set Up Environment Variables**
   - The `.env` file is already created with `PORT=3000`
   - You can change the port if needed

4. **Start the Server**
   ```
   npm start
   ```

5. **Open Your Browser**
   - Go to `http://localhost:3000`
   - You'll see the product inventory interface

## Usage

### Accessing the Application

- **Frontend**: Visit `http://localhost:3000` in your browser
- **API**: Use tools like Postman or curl to access `http://localhost:3000/api/products`

### Using the Frontend

1. **View Products**: Products are displayed in cards on the main page
2. **Filter Products**:
   - Enter category, price range, or search terms
   - Select sorting options
   - Click "Apply Filters"
3. **Add a Product**:
   - Scroll to the "Add New Product" section
   - Fill in all fields (name, category, price, stock, description)
   - Click "Save Product"
4. **Edit a Product**:
   - Click "Edit" on any product card
   - Modify the fields in the form
   - Click "Save Product"
5. **Delete a Product**:
   - Click "Delete" on any product card
   - Confirm the deletion

### API Usage Examples

#### Get All Products
```bash
GET http://localhost:3000/api/products
```

#### Get Products with Filters
```bash
GET http://localhost:3000/api/products?category=electronics&priceMin=100&priceMax=1000&page=1&limit=5&sortBy=price&order=asc
```

#### Get Single Product
```bash
GET http://localhost:3000/api/products/{id}
```

#### Create Product
```bash
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "New Product",
  "category": "category",
  "price": 99.99,
  "stock": 10,
  "description": "Product description"
}
```

#### Update Product
```bash
PUT http://localhost:3000/api/products/{id}
Content-Type: application/json

{
  "name": "Updated Product",
  "category": "category",
  "price": 149.99,
  "stock": 15,
  "description": "Updated description"
}
```

#### Delete Product
```bash
DELETE http://localhost:3000/api/products/{id}
```

## API Endpoints

| Method | Endpoint | Description | Example Response |
|--------|----------|-------------|------------------|
| GET | `/api/products` | Get all products with optional filters | `{success: true, data: {products: [...], pagination: {...}}}` |
| GET | `/api/products/:id` | Get single product by ID | `{success: true, data: {product}}` |
| POST | `/api/products` | Create new product | `{success: true, data: {product}}` |
| PUT | `/api/products/:id` | Update existing product | `{success: true, data: {product}}` |
| DELETE | `/api/products/:id` | Delete product | `{success: true, message: "Product deleted"}` |

### Query Parameters for GET /api/products

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `priceMin`: Minimum price filter
- `priceMax`: Maximum price filter
- `search`: Search in product names
- `sortBy`: Sort by 'name' or 'price'
- `order`: 'asc' or 'desc' (default: 'asc')

## Project Structure

```
product-inventory-api/
├── public/                 # Static frontend files
│   ├── css/
│   │   └── style.css      # Frontend styles
│   ├── js/
│   │   └── app.js         # Frontend JavaScript
│   └── index.html         # Main HTML page
├── src/                    # Backend source code
│   ├── controllers/
│   │   └── product.controller.js  # API logic
│   ├── data/
│   │   └── products.js     # Sample product data
│   ├── middleware/
│   │   ├── errorMiddleware.js    # Error handling
│   │   └── loggingMiddleware.js  # Request logging
│   ├── routes/
│   │   └── product.routes.js      # API routes
│   ├── utils/
│   │   ├── errorHandler.js       # Custom error class
│   │   └── responseFormatter.js  # Response formatting
│   └── index.js            # Server entry point
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
└── README.md               # This file
```

## Understanding the Code

### Backend Structure

- **index.js**: Sets up the Express server, middleware, and routes
- **productController.js**: Contains functions for handling API requests
- **productRoutes.js**: Defines the API endpoints and connects them to controller functions
- **products.js**: Holds the sample product data in an array

### Frontend Structure

- **index.html**: The main page structure
- **style.css**: Makes the page look nice
- **app.js**: Handles user interactions and API calls

### Key Concepts

- **Middleware**: Functions that run before your route handlers (like logging and error handling)
- **Routes**: Define what happens when someone visits a URL
- **Controllers**: Contain the logic for handling requests
- **REST API**: A style of API that uses HTTP methods (GET, POST, PUT, DELETE)

## Troubleshooting

### Common Issues

1. **Server won't start**
   - Make sure Node.js is installed
   - Check if port 3000 is already in use
   - Try changing the PORT in .env

2. **Page doesn't load**
   - Ensure the server is running
   - Check the browser console for errors
   - Try refreshing the page

3. **API requests fail**
   - Verify the server is running
   - Check the request URL and method
   - Look at browser developer tools network tab

### Development Tips

- Use browser developer tools (F12) to inspect network requests
- Check the server console for error messages
- The data resets when you restart the server (since it's in-memory)

## Contributing

This is a learning project! Feel free to:
- Report bugs or suggest features
- Improve the code or documentation
- Add more features like user authentication or a real database

## License

This project is open source and available under the MIT License.

---

Happy coding! If you have questions, check the code comments or search online for the technologies used.
