const express = require('express');
const app = express();

app.get('/api/status', (req, res) => {
  res.json({ status: 'Cluster Running', nodes: 10 });
});

app.listen(3000, () => {
  console.log('Cluster Manager API running on port 3000');
});