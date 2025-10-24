import products from '../data/products.js';
import formatResponse from '../utils/responseFormatter.js';
import AppError from '../utils/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

// GET /api/products
export const getProducts = (req, res, next) => {
  try {
    let filteredProducts = [...products];

    // Filtering by category
    const { category } = req.query;
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    // Filtering by price range
    const { priceMin, priceMax } = req.query;
    if (priceMin) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(priceMin));
    }
    if (priceMax) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(priceMax));
    }

    // Searching by name
    const { search } = req.query;
    if (search) {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Sorting
    const { sortBy, order = 'asc' } = req.query;
    if (sortBy && (sortBy === 'price' || sortBy === 'name')) {
      filteredProducts.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        if (sortBy === 'name') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (order === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    const data = {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        limit
      }
    };

    res.json(formatResponse(true, 'Products retrieved successfully', 200, data));
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = (req, res, next) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json(formatResponse(true, 'Product retrieved successfully', 200, product));
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = (req, res, next) => {
  try {
    const { name, category, price, stock, description } = req.body;

    if (!name || !category || price === undefined || stock === undefined || !description) {
      return next(new AppError('All fields are required', 400));
    }

    if (price < 0 || stock < 0) {
      return next(new AppError('Price and stock must be non-negative', 400));
    }

    const newProduct = {
      id: uuidv4(),
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description
    };

    products.push(newProduct);

    res.status(201).json(formatResponse(true, 'Product created successfully', 201, newProduct));
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, description } = req.body;

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return next(new AppError('Product not found', 404));
    }

    if (price !== undefined && price < 0) {
      return next(new AppError('Price must be non-negative', 400));
    }

    if (stock !== undefined && stock < 0) {
      return next(new AppError('Stock must be non-negative', 400));
    }

    const updatedProduct = { ...products[productIndex] };

    if (name !== undefined) updatedProduct.name = name;
    if (category !== undefined) updatedProduct.category = category;
    if (price !== undefined) updatedProduct.price = parseFloat(price);
    if (stock !== undefined) updatedProduct.stock = parseInt(stock);
    if (description !== undefined) updatedProduct.description = description;

    products[productIndex] = updatedProduct;

    res.json(formatResponse(true, 'Product updated successfully', 200, updatedProduct));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return next(new AppError('Product not found', 404));
    }

    products.splice(productIndex, 1);

    res.json(formatResponse(true, 'Product deleted successfully', 200));
  } catch (error) {
    next(error);
  }
};