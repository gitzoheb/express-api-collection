const API_BASE = '/notes';

const form = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const notesList = document.getElementById('notes-list');

// Load notes on page load
document.addEventListener('DOMContentLoaded', loadNotes);

// Form submit
form.addEventListener('submit', addNote);

// Functions
async function loadNotes() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        if (data.success) {
            displayNotes(data.data);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

function displayNotes(notes) {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-buttons">
                <button class="edit-btn" onclick="editNote(${note.id})">Edit</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        `;
        notesList.appendChild(noteDiv);
    });
}

async function addNote(e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) return;

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        const data = await response.json();
        if (data.success) {
            titleInput.value = '';
            contentInput.value = '';
            loadNotes();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

async function editNote(id) {
    const newTitle = prompt('Enter new title:');
    const newContent = prompt('Enter new content:');
    if (!newTitle || !newContent) return;

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });
        const data = await response.json();
        if (data.success) {
            loadNotes();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error editing note:', error);
    }
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            loadNotes();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}