document.addEventListener('DOMContentLoaded', () => {
  loadPolls();

  const pollForm = document.getElementById('poll-form');
  const addOptionBtn = document.getElementById('add-option');

  pollForm.addEventListener('submit', createPoll);
  addOptionBtn.addEventListener('click', addOption);
});

async function loadPolls() {
  try {
    const response = await fetch('/polls');
    const data = await response.json();
    if (data.success) {
      displayPolls(data.data);
    } else {
      alert('Error loading polls: ' + data.error);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function displayPolls(polls) {
  const pollsList = document.getElementById('polls-list');
  pollsList.innerHTML = '';

  polls.forEach(poll => {
    const pollDiv = document.createElement('div');
    pollDiv.className = 'poll';

    const question = document.createElement('h3');
    question.textContent = poll.question;
    pollDiv.appendChild(question);

    poll.options.forEach((option, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'poll-option';

      const optionText = document.createElement('span');
      optionText.textContent = `${option}: ${poll.votes[index]} votes`;
      optionDiv.appendChild(optionText);

      const voteBtn = document.createElement('button');
      voteBtn.className = 'vote-btn';
      voteBtn.textContent = 'Vote';
      voteBtn.addEventListener('click', () => voteOnPoll(poll.id, index));
      optionDiv.appendChild(voteBtn);

      pollDiv.appendChild(optionDiv);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete Poll';
    deleteBtn.addEventListener('click', () => deletePoll(poll.id));
    pollDiv.appendChild(deleteBtn);

    pollsList.appendChild(pollDiv);
  });
}

async function createPoll(event) {
  event.preventDefault();

  const question = document.getElementById('question').value;
  const optionInputs = document.querySelectorAll('.option-input');
  const options = Array.from(optionInputs).map(input => input.value).filter(val => val.trim() !== '');

  if (options.length < 2) {
    alert('At least 2 options required');
    return;
  }

  try {
    const response = await fetch('/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, options })
    });
    const data = await response.json();
    if (data.success) {
      document.getElementById('poll-form').reset();
      // Reset options to 2
      const optionsContainer = document.getElementById('options-container');
      optionsContainer.innerHTML = `
        <div class="option">
          <input type="text" class="option-input" placeholder="Option 1" required>
        </div>
        <div class="option">
          <input type="text" class="option-input" placeholder="Option 2" required>
        </div>
      `;
      loadPolls();
    } else {
      alert('Error creating poll: ' + data.error);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function addOption() {
  const optionsContainer = document.getElementById('options-container');
  const optionDiv = document.createElement('div');
  optionDiv.className = 'option';
  optionDiv.innerHTML = '<input type="text" class="option-input" placeholder="New Option" required>';
  optionsContainer.appendChild(optionDiv);
}

async function voteOnPoll(pollId, optionIndex) {
  try {
    const response = await fetch(`/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionIndex })
    });
    const data = await response.json();
    if (data.success) {
      loadPolls();
    } else {
      alert('Error voting: ' + data.error);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function deletePoll(pollId) {
  if (!confirm('Are you sure you want to delete this poll?')) return;

  try {
    const response = await fetch(`/polls/${pollId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data.success) {
      loadPolls();
    } else {
      alert('Error deleting poll: ' + data.error);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}