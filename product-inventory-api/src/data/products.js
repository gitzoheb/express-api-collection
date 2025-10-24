import { v4 as uuidv4 } from 'uuid';

const products = [
  {
    id: uuidv4(),
    name: "Laptop",
    category: "electronics",
    price: 999.99,
    stock: 10,
    description: "High-performance laptop for work and gaming"
  },
  {
    id: uuidv4(),
    name: "Smartphone",
    category: "electronics",
    price: 699.99,
    stock: 25,
    description: "Latest smartphone with advanced features"
  },
  {
    id: uuidv4(),
    name: "Coffee Maker",
    category: "appliances",
    price: 49.99,
    stock: 15,
    description: "Automatic coffee maker for home use"
  },
  {
    id: uuidv4(),
    name: "Running Shoes",
    category: "sports",
    price: 129.99,
    stock: 30,
    description: "Comfortable running shoes for athletes"
  },
  {
    id: uuidv4(),
    name: "Book: JavaScript Guide",
    category: "books",
    price: 29.99,
    stock: 50,
    description: "Comprehensive guide to JavaScript programming"
  },
  {
    id: uuidv4(),
    name: "Headphones",
    category: "electronics",
    price: 199.99,
    stock: 20,
    description: "Wireless headphones with noise cancellation"
  },
  {
    id: uuidv4(),
    name: "Blender",
    category: "appliances",
    price: 79.99,
    stock: 12,
    description: "Powerful blender for smoothies and more"
  },
  {
    id: uuidv4(),
    name: "Yoga Mat",
    category: "sports",
    price: 39.99,
    stock: 40,
    description: "Non-slip yoga mat for fitness enthusiasts"
  }
];

export default products;