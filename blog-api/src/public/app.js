// API base URL
const API_BASE = 'http://localhost:3000/posts';

// DOM elements
const postForm = document.getElementById('post-form');
const postsContainer = document.getElementById('posts-container');
const messageDiv = document.getElementById('message');

// Load posts on page load
document.addEventListener('DOMContentLoaded', loadPosts);

// Form submit event
postForm.addEventListener('submit', handleCreatePost);

// API functions
async function loadPosts() {
  try {
    const response = await fetch(API_BASE);
    const result = await response.json();

    if (result.success) {
      renderPosts(result.data);
      showMessage('Posts loaded successfully', 'success');
    } else {
      showMessage('Failed to load posts', 'error');
    }
  } catch (error) {
    showMessage('Error loading posts', 'error');
    console.error('Error:', error);
  }
}

async function createPost(postData) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const result = await response.json();

    if (result.success) {
      showMessage('Post created successfully', 'success');
      loadPosts(); // Refresh posts
      postForm.reset(); // Clear form
    } else {
      showMessage(result.message || 'Failed to create post', 'error');
    }
  } catch (error) {
    showMessage('Error creating post', 'error');
    console.error('Error:', error);
  }
}

async function updatePost(id, postData) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const result = await response.json();

    if (result.success) {
      showMessage('Post updated successfully', 'success');
      loadPosts(); // Refresh posts
      hideEditForm();
    } else {
      showMessage(result.message || 'Failed to update post', 'error');
    }
  } catch (error) {
    showMessage('Error updating post', 'error');
    console.error('Error:', error);
  }
}

async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();

    if (result.success) {
      showMessage('Post deleted successfully', 'success');
      loadPosts(); // Refresh posts
    } else {
      showMessage(result.message || 'Failed to delete post', 'error');
    }
  } catch (error) {
    showMessage('Error deleting post', 'error');
    console.error('Error:', error);
  }
}

// DOM manipulation
function renderPosts(posts) {
  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p>No posts yet. Create your first post!</p>';
    return;
  }

  posts.forEach(post => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  postDiv.innerHTML = `
    <h3>${escapeHtml(post.title)}</h3>
    <div class="author">By: ${escapeHtml(post.author)}</div>
    <div class="content">${escapeHtml(post.content)}</div>
    <div class="post-actions">
      <button class="btn btn-secondary edit-btn" data-id="${post.id}">Edit</button>
      <button class="btn btn-danger delete-btn" data-id="${post.id}">Delete</button>
    </div>
    <div class="edit-form" id="edit-form-${post.id}">
      <div class="form-group">
        <label>Title *</label>
        <input type="text" class="edit-title" value="${escapeHtml(post.title)}" required>
      </div>
      <div class="form-group">
        <label>Content *</label>
        <textarea class="edit-content" rows="4" required>${escapeHtml(post.content)}</textarea>
      </div>
      <div class="form-group">
        <label>Author</label>
        <input type="text" class="edit-author" value="${escapeHtml(post.author)}">
      </div>
      <div class="post-actions">
        <button class="btn btn-primary save-edit-btn" data-id="${post.id}">Save</button>
        <button class="btn btn-secondary cancel-edit-btn" data-id="${post.id}">Cancel</button>
      </div>
    </div>
  `;

  // Add event listeners
  const editBtn = postDiv.querySelector('.edit-btn');
  const deleteBtn = postDiv.querySelector('.delete-btn');
  const saveBtn = postDiv.querySelector('.save-edit-btn');
  const cancelBtn = postDiv.querySelector('.cancel-edit-btn');

  editBtn.addEventListener('click', () => showEditForm(post.id));
  deleteBtn.addEventListener('click', () => deletePost(post.id));
  saveBtn.addEventListener('click', () => handleUpdatePost(post.id));
  cancelBtn.addEventListener('click', () => hideEditForm(post.id));

  return postDiv;
}

function showEditForm(postId) {
  const editForm = document.getElementById(`edit-form-${postId}`);
  editForm.classList.add('show');
}

function hideEditForm(postId) {
  if (postId) {
    const editForm = document.getElementById(`edit-form-${postId}`);
    editForm.classList.remove('show');
  } else {
    // Hide all edit forms
    document.querySelectorAll('.edit-form').forEach(form => {
      form.classList.remove('show');
    });
  }
}

// Event handlers
function handleCreatePost(e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !content) {
    showMessage('Title and content are required', 'error');
    return;
  }

  const postData = { title, content, author: author || 'Anonymous' };
  createPost(postData);
}

function handleUpdatePost(postId) {
  const postElement = document.querySelector(`#edit-form-${postId}`);
  const title = postElement.querySelector('.edit-title').value.trim();
  const content = postElement.querySelector('.edit-content').value.trim();
  const author = postElement.querySelector('.edit-author').value.trim();

  if (!title || !content) {
    showMessage('Title and content are required', 'error');
    return;
  }

  const postData = { title, content, author: author || 'Anonymous' };
  updatePost(postId, postData);
}

// Utility functions
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}