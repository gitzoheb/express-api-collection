# Pagination and Filtering API

A simple Node.js Express API that demonstrates how to implement pagination and dynamic filtering for a list of items.

## Table of Contents
- [Features](#features)
- [How It Works](#how-it-works)
  - [Data Structure](#data-structure)
  - [Filter Options Endpoint](#filter-options-endpoint)
  - [Items Endpoint with Pagination and Filtering](#items-endpoint-with-pagination-and-filtering)
- [Code Implementation](#code-implementation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Item Schema](#item-schema)
- [Response Format](#response-format)

## Features
- In-memory data storage (static array of products)
- Pagination (limit and page number)
- Dynamic filtering by item properties (category, brand, price, name)
- Supports string matching (case-insensitive `includes`)
- Supports numeric comparisons for price (e.g., `>`, `<`, `>=`, `<=`, ranges `min-max`, exact match)
- Provides available filter options (categories, brands, price range)
- Serves a basic `index.html` for client-side interaction example

## How It Works

This API provides a `GET /items` endpoint that supports pagination and various filtering options. It also exposes a `GET /filter-options` endpoint to dynamically retrieve available categories, brands, and price ranges.

### Data Structure
The API uses a static in-memory array of `items` defined in `src/index.js`. Each item includes `id`, `name`, `category`, `price`, and `brand`.
```D:/express-api-collection/pagination-filter-api/src/index.js#L18-38
const items = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 1200, brand: 'Dell' },
  { id: 2, name: 'Smartphone', category: 'electronics', price: 800, brand: 'Samsung' },
  { id: 3, name: 'Book: JavaScript Guide', category: 'books', price: 25, brand: 'OReilly' },
  { id: 4, name: 'Headphones', category: 'electronics', price: 150, brand: 'Sony' },
  { id: 5, name: 'T-Shirt', category: 'clothing', price: 20, brand: 'Nike' },
  { id: 6, name: 'Book: Node.js Basics', category: 'books', price: 30, brand: 'Packt' },
  { id: 7, name: 'Tablet', category: 'electronics', price: 500, brand: 'Apple' },
  { id: 8, name: 'Jeans', category: 'clothing', price: 60, brand: 'Levi' },
  { id: 9, name: 'Book: Express Handbook', category: 'books', price: 35, brand: 'Apress' },
  { id: 10, name: 'Monitor', category: 'electronics', price: 300, brand: 'LG' },
  { id: 11, name: 'Sneakers', category: 'clothing', price: 100, brand: 'Adidas' },
  { id: 12, name: 'Book: API Design', category: 'books', price: 40, brand: 'Manning' },
  { id: 13, name: 'Keyboard', category: 'electronics', price: 80, brand: 'Logitech' },
  { id: 14, name: 'Jacket', category: 'clothing', price: 120, brand: 'Puma' },
  { id: 15, name: 'Book: Database Systems', category: 'books', price: 50, brand: 'Pearson' },
  { id: 16, name: 'Mouse', category: 'electronics', price: 25, brand: 'Razer' },
  { id: 17, name: 'Hat', category: 'clothing', price: 15, brand: 'New Era' },
  { id: 18, name: 'Book: Web Development', category: 'books', price: 45, brand: 'Wiley' },
  { id: 19, name: 'Speaker', category: 'electronics', price: 200, brand: 'JBL' },
  { id: 20, name: 'Socks', category: 'clothing', price: 10, brand: 'H&M' }
];
```

### Filter Options Endpoint
The `/filter-options` endpoint provides a list of unique categories, brands, and the minimum/maximum price found in the `items` data. This is useful for populating filter UIs on the client-side.
```javascript
app.get('/filter-options', (req, res) => {
  const categories = [...new Set(items.map(item => item.category))].sort();
  const brands = [...new Set(items.map(item => item.brand))].sort();
  const prices = items.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  res.json({
    categories,
    brands,
    priceRange: { min: minPrice, max: maxPrice }
  });
});
```

### Items Endpoint with Pagination and Filtering
The `/items` endpoint handles the core logic for filtering and pagination.
1.  **Filtering**: It iterates through query parameters (excluding `page` and `limit`) and applies them as filters.
    *   **String Fields**: Filters for partial, case-insensitive matches (`.includes()`).
    *   **Numeric Fields (e.g., `price`)**: Supports exact matches, range queries (`min-max`), and operators like `>`, `<`, `>=`, `<=`.
2.  **Pagination**: After filtering, it calculates the total number of filtered items and the total pages based on the `limit` parameter. It then slices the `filteredItems` array to return only the items for the requested `page`.
3.  **Response**: The response includes `page`, `limit`, `totalItems`, `totalPages`, an optional `message` for edge cases (e.g., page exceeds total pages, no items found), and the `data` (paginated items).

```D:/express-api-collection/pagination-filter-api/src/index.js#L52-113
app.get('/items', (req, res) => {
  // Start with a copy of all items for filtering
  let filteredItems = [...items];

  // Extract query parameters for filtering, excluding pagination params
  const filters = { ...req.query };
  delete filters.page;
  delete filters.limit;

  // Apply filters based on query parameters
  // Supports string matching (case-insensitive includes) and numeric comparisons with operators
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      filteredItems = filteredItems.filter(item => {
        const itemValue = item[key];
        const filterValue = filters[key];

        if (typeof itemValue === 'string') {
          // String filtering: check if filter value is included in item value (case-insensitive)
          return itemValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof itemValue === 'number') {
          // Numeric filtering: support operators like >, <, >=, <=, or exact match
          if (filterValue.startsWith('>=')) {
            return itemValue >= parseFloat(filterValue.slice(2));
          } else if (filterValue.startsWith('>')) {
            return itemValue > parseFloat(filterValue.slice(1));
          } else if (filterValue.startsWith('<=')) {
            return itemValue <= parseFloat(filterValue.slice(2));
           } else if (filterValue.startsWith('<')) {
             return itemValue < parseFloat(filterValue.slice(1));
           } else if (filterValue.includes('-')) {
             const [min, max] = filterValue.split('-').map(Number);
             return itemValue >= min && itemValue <= max;
           } else {
             // Exact match for numbers
             return itemValue === parseFloat(filterValue);
           }
        }
        // If property doesn't exist or type mismatch, exclude the item
        return false;
      });
    }
  }

  // Parse pagination parameters with defaults and validation
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  // Validate page and limit
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  // Calculate total items after filtering
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / limit);

  // Handle invalid page numbers gracefully
  let message = null;
  if (page > totalPages && totalItems > 0) {
    message = 'Page number exceeds available pages';
    page = totalPages; // Optionally set to last page, or keep as is for empty data
  } else if (totalItems === 0) {
    message = 'No items match the specified filters';
  }

  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Return JSON response with metadata and data
  res.json({
    page,
    limit,
    totalItems,
    totalPages,
    message, // Optional message for edge cases
    data: paginatedItems
  });
});
```

## Installation
```bash
npm install
```

## Usage
```bash
npm run dev
```
The server will run on `http://localhost:3000`. You can access the API endpoints and an example `index.html` file demonstrating how to use the API.

## API Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/` | Serves `public/index.html` | None |
| GET | `/filter-options` | Get available filter options (categories, brands, price range) | None |
| GET | `/items` | Get paginated and filtered list of items | `page` (number, default: 1), `limit` (number, default: 10), `name` (string, partial match), `category` (string, partial match), `brand` (string, partial match), `price` (number or string: `>100`, `<50`, `>=20`, `<=30`, `20-50`) |

### Example API Calls

#### Get all items (page 1, limit 10)
```
GET http://localhost:3000/items
```

#### Get items, page 2, 5 items per page
```
GET http://localhost:3000/items?page=2&limit=5
```

#### Filter items by category "electronics"
```
GET http://localhost:3000/items?category=electronics
```

#### Filter items by brand "Dell" and price greater than 1000
```
GET http://localhost:3000/items?brand=Dell&price=>1000
```

#### Filter items by name "Book" and price between 20 and 40, page 1, limit 3
```
GET http://localhost:3000/items?name=Book&price=20-40&page=1&limit=3
```

#### Get filter options
```
GET http://localhost:3000/filter-options
```

## Item Schema
```json
{
  "id": 1,
  "name": "Laptop",
  "category": "electronics",
  "price": 1200,
  "brand": "Dell"
}
```

## Response Format
The `/items` endpoint returns an object with pagination metadata and an array of items. The `/filter-options` endpoint returns an object with arrays of categories, brands, and a price range.

**Success Response (for `/items`):**
```json
{
  "page": 1,
  "limit": 10,
  "totalItems": 20,
  "totalPages": 2,
  "message": null,
  "data": [
    { "id": 1, "name": "Laptop", "category": "electronics", "price": 1200, "brand": "Dell" },
    // ... other items
  ]
}
```

**Success Response (for `/filter-options`):**
```json
{
  "categories": ["books", "clothing", "electronics"],
  "brands": ["Adidas", "Apple", "Apress", "Dell", "H&M", "JBL", "Levi", "LG", "Logitech", "Manning", "New Era", "Nike", "OReilly", "Packt", "Pearson", "Puma", "Razer", "Samsung", "Sony", "Wiley"],
  "priceRange": {
    "min": 10,
    "max": 1200
  }
}
```

## Code Implementation

### Backend
The backend is built with Node.js and Express. It serves static files from the `public` directory and provides API endpoints for items and filter options.

- **Filter Options Endpoint**: Computes unique categories, brands, and price range from the static data.
- **Items Endpoint**: Handles filtering and pagination logic, supporting string and numeric filters.

### Frontend
The frontend consists of HTML, CSS, and JavaScript for a simple web interface to interact with the API.

#### HTML Structure (public/index.html)
The HTML includes sections for filters (with dropdown selects), pagination controls, and item display.

```html
<section id="filters">
  <h2>Filters</h2>
  <form id="filterForm">
    <label for="category">Category:</label>
    <select id="category" name="category">
      <option value="">All</option>
      <!-- Options populated dynamically -->
    </select>

    <label for="price">Price:</label>
    <select id="price" name="price">
      <option value="">All</option>
      <!-- Options for price ranges -->
    </select>

    <label for="brand">Brand:</label>
    <select id="brand" name="brand">
      <option value="">All</option>
      <!-- Options populated dynamically -->
    </select>

    <button type="submit">Apply Filters</button>
    <button type="button" id="clearFilters">Clear Filters</button>
  </form>
</section>
```

#### JavaScript Logic (public/app.js)
The JavaScript fetches filter options on load, populates the selects, handles form submission to apply filters, and manages pagination.

Key functions:
- `populateFilters()`: Fetches and populates category and brand selects; defines price ranges.
- `updateFilters()`: Collects form data into current filters.
- `fetchItems()`: Calls the API with current page, limit, and filters.

#### CSS Styling (public/style.css)
Styles the layout, forms, and item cards for a clean, responsive design.

```css
#filters form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

#filters input, #filters select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}
```
