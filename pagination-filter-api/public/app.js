// State variables
let currentPage = 1;
let currentLimit = 10;
let currentFilters = {};

// DOM elements
const filterForm = document.getElementById('filterForm');
const clearFiltersBtn = document.getElementById('clearFilters');
const categorySelect = document.getElementById('category');
const priceSelect = document.getElementById('price');
const brandSelect = document.getElementById('brand');
const limitSelect = document.getElementById('limit');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const itemsList = document.getElementById('itemsList');
const loadingDiv = document.getElementById('loading');
const messageDiv = document.getElementById('message');

// Populate filter dropdowns
async function populateFilters() {
  try {
    const response = await fetch('/filter-options');
    const data = await response.json();

    // Populate category
    data.categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categorySelect.appendChild(option);
    });

    // Populate brand
    data.brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });

    // Populate price ranges
    const ranges = [
      { value: '<50', label: 'Under $50' },
      { value: '50-200', label: '$50 - $200' },
      { value: '>200', label: 'Over $200' }
    ];
    ranges.forEach(range => {
      const option = document.createElement('option');
      option.value = range.value;
      option.textContent = range.label;
      priceSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
  }
}

// Update brand options based on selected category
async function updateBrandOptions() {
  const category = categorySelect.value;
  const url = category ? `/filter-options?category=${encodeURIComponent(category)}` : '/filter-options';

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Clear existing brand options except "All"
    brandSelect.innerHTML = '<option value="">All</option>';

    // Add new brands
    data.brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error updating brand options:', error);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  populateFilters();
  fetchItems();
});

// Fetch items from the API
async function fetchItems() {
  showLoading();

  // Build query string
  const params = new URLSearchParams({
    page: currentPage,
    limit: currentLimit,
    ...currentFilters
  });

  try {
    const response = await fetch(`/items?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    const data = await response.json();
    renderItems(data);
  } catch (error) {
    showMessage('Error fetching items: ' + error.message);
    hideLoading();
  }
}

// Render items to the DOM
function renderItems(data) {
  hideLoading();

  // Update pagination info
  pageInfo.textContent = `Page ${data.page} of ${data.totalPages}`;
  prevPageBtn.disabled = data.page <= 1;
  nextPageBtn.disabled = data.page >= data.totalPages;

  // Clear previous items
  itemsList.innerHTML = '';

  // Render items
  if (data.data.length === 0) {
    itemsList.innerHTML = '<li>No items found.</li>';
  } else {
    data.data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item-card';
      li.innerHTML = `
        <h3>${item.name}</h3>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Price:</strong> $${item.price}</p>
        <p><strong>Brand:</strong> ${item.brand}</p>
      `;
      itemsList.appendChild(li);
    });
  }

  // Show API message if present
  if (data.message) {
    showMessage(data.message);
  } else {
    hideMessage();
  }
}

// Show loading indicator
function showLoading() {
  loadingDiv.style.display = 'block';
  itemsList.style.display = 'none';
}

// Hide loading indicator
function hideLoading() {
  loadingDiv.style.display = 'none';
  itemsList.style.display = 'grid';
}

// Show message
function showMessage(msg) {
  messageDiv.textContent = msg;
  messageDiv.style.display = 'block';
}

// Hide message
function hideMessage() {
  messageDiv.style.display = 'none';
}

// Update current filters from form
function updateFilters() {
  const formData = new FormData(filterForm);
  currentFilters = {};
  for (let [key, value] of formData) {
    if (value) { // only add if not empty
      currentFilters[key] = value;
    }
  }
}

// Event listeners
categorySelect.addEventListener('change', () => {
  updateBrandOptions();
});

filterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  updateFilters();
  currentPage = 1; // Reset to first page
  fetchItems();
});

clearFiltersBtn.addEventListener('click', () => {
  filterForm.reset();
  currentFilters = {};
  currentPage = 1;
  updateBrandOptions(); // Reset brands to all
  fetchItems();
});

limitSelect.addEventListener('change', () => {
  currentLimit = parseInt(limitSelect.value);
  currentPage = 1; // Reset to first page
  fetchItems();
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchItems();
  }
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;
  fetchItems();
});