import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Sample data: Static array of product items
// Each item has id, name, category, price, and brand for filtering examples
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

// API endpoint for filter options
app.get('/filter-options', (req, res) => {
  const categories = [...new Set(items.map(item => item.category))].sort();
  let filteredItems = items;

  // If category is specified, filter items by category
  if (req.query.category) {
    filteredItems = items.filter(item => item.category === req.query.category);
  }

  const brands = [...new Set(filteredItems.map(item => item.brand))].sort();
  const prices = items.map(item => item.price); // Always use all for price range
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  res.json({
    categories,
    brands,
    priceRange: { min: minPrice, max: maxPrice }
  });
});

// API endpoint for items with pagination and filtering
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});