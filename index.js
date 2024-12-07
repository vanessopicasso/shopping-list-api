const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Sample endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Shopping List App server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});