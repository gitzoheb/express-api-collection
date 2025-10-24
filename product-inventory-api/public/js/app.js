const API_BASE = '/api/products';

let currentPage = 1;
let currentLimit = 10;
let currentFilters = {};

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  document.getElementById('filterForm').addEventListener('submit', handleFilterSubmit);
  document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
  document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
});

async function loadProducts(page = 1, limit = 10, filters = {}) {
  currentPage = page;
  currentLimit = limit;
  currentFilters = filters;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });

  try {
    const response = await fetch(`${API_BASE}?${queryParams}`);
    const data = await response.json();

    if (data.success) {
      displayProducts(data.data.products);
      displayPagination(data.data.pagination);
    } else {
      alert('Error loading products: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error loading products');
  }
}

function displayProducts(products) {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <h3>${product.name}</h3>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Description:</strong> ${product.description}</p>
      <div class="product-actions">
        <button onclick="editProduct('${product.id}')">Edit</button>
        <button onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    `;
    productList.appendChild(productCard);
  });
}

function displayPagination(pagination) {
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = '';

  if (pagination.totalPages > 1) {
    for (let i = 1; i <= pagination.totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.onclick = () => loadProducts(i, currentLimit, currentFilters);
      if (i === pagination.currentPage) {
        button.disabled = true;
      }
      paginationDiv.appendChild(button);
    }
  }
}

function handleFilterSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const filters = {};

  for (let [key, value] of formData.entries()) {
    if (value.trim() !== '') {
      filters[key] = value;
    }
  }

  loadProducts(1, currentLimit, filters);
}

function handleProductSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productData = {};

  for (let [key, value] of formData.entries()) {
    if (key === 'price') {
      productData[key] = parseFloat(value);
    } else if (key === 'stock') {
      productData[key] = parseInt(value);
    } else {
      productData[key] = value;
    }
  }

  const productId = document.getElementById('productId').value;

  if (productId) {
    updateProduct(productId, productData);
  } else {
    createProduct(productData);
  }
}

async function createProduct(productData) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (data.success) {
      alert('Product created successfully');
      resetForm();
      loadProducts(currentPage, currentLimit, currentFilters);
    } else {
      alert('Error creating product: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error creating product');
  }
}

async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (data.success) {
      alert('Product updated successfully');
      resetForm();
      loadProducts(currentPage, currentLimit, currentFilters);
    } else {
      alert('Error updating product: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error updating product');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      alert('Product deleted successfully');
      loadProducts(currentPage, currentLimit, currentFilters);
    } else {
      alert('Error deleting product: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error deleting product');
  }
}

function editProduct(id) {
  // Fetch product details
  fetch(`${API_BASE}/${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const product = data.data;
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('formCategory').value = product.category;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        document.getElementById('description').value = product.description;
        document.getElementById('formTitle').textContent = 'Edit Product';
        document.getElementById('productFormSection').scrollIntoView();
      } else {
        alert('Error loading product: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error loading product');
    });
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('formTitle').textContent = 'Add New Product';
}