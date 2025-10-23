let posts = [];
let nextId = 1;

export const getAllPosts = (req, res) => {
  res.json({ success: true, data: posts });
};

export const getPostById = (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  res.json({ success: true, data: post });
};

export const createPost = (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Title and content are required" });
  }
  const newPost = { id: nextId++, title, content, author: author || "Anonymous" };
  posts.push(newPost);
  res.status(201).json({ success: true, data: newPost });
};

export const updatePost = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, author } = req.body;
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Title and content are required" });
  }
  posts[postIndex] = { ...posts[postIndex], title, content, author: author || posts[postIndex].author };
  res.json({ success: true, data: posts[postIndex] });
};

export const deletePost = (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }
  posts.splice(postIndex, 1);
  res.json({ success: true, message: "Post deleted successfully" });
};