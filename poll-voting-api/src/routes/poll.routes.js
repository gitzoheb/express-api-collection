import express from 'express';
import {
  getAllPolls,
  getPollById,
  createPoll,
  voteOnPoll,
  deletePoll
} from '../controllers/poll.controllers.js';

const router = express.Router();

router.get('/', getAllPolls);
router.get('/:id', getPollById);
router.post('/', createPoll);
router.post('/:id/vote', voteOnPoll);
router.delete('/:id', deletePoll);

export default router;