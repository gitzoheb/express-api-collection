import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World! This is an ES Module Express app.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
