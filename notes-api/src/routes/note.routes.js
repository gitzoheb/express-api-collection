import express from 'express';
const router = express.Router();
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/note.controller.js';

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;