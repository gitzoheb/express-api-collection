let notes = [];

export const getAllNotes = (req, res) => {
  res.json({ success: true, data: notes });
};

export const getNoteById = (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find((n) => n.id === id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json({ success: true, data: note });
};

export const createNote = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
    title,
    content,
  };
  notes.push(newNote);
  res.status(201).json({ success: true, data: newNote });
};

export const updateNote = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  notes[noteIndex] = { id, title, content };
  res.json({ success: true, data: notes[noteIndex] });
};

export const deleteNote = (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  notes.splice(noteIndex, 1);
  res.json({ success: true, message: "Note deleted" });
};
