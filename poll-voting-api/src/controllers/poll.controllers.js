import { randomUUID } from 'crypto';

const polls = [];

export const getAllPolls = (req, res) => {
  res.json({ success: true, data: polls });
};

export const getPollById = (req, res) => {
  const { id } = req.params;
  const poll = polls.find(p => p.id === id);
  if (!poll) {
    return res.status(404).json({ success: false, error: 'Poll not found' });
  }
  res.json({ success: true, data: poll });
};

export const createPoll = (req, res) => {
  const { question, options } = req.body;
  if (!question || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ success: false, error: 'Question and at least 2 options required' });
  }
  const newPoll = {
    id: randomUUID(),
    question,
    options,
    votes: new Array(options.length).fill(0)
  };
  polls.push(newPoll);
  res.status(201).json({ success: true, data: newPoll });
};

export const voteOnPoll = (req, res) => {
  const { id } = req.params;
  const { optionIndex } = req.body;
  const poll = polls.find(p => p.id === id);
  if (!poll) {
    return res.status(404).json({ success: false, error: 'Poll not found' });
  }
  if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({ success: false, error: 'Invalid option index' });
  }
  poll.votes[optionIndex]++;
  res.json({ success: true, data: poll });
};

export const deletePoll = (req, res) => {
  const { id } = req.params;
  const index = polls.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Poll not found' });
  }
  polls.splice(index, 1);
  res.json({ success: true, message: 'Poll deleted' });
};