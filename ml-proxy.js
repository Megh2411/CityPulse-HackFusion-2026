const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const app = express();
const upload = multer();

app.use(express.json());
app.use(require('cors')());

// Proxy to your Python ML service
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Forward to Python service
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'ML service unavailable' });
  }
});

app.listen(3001, () => {
  console.log('ML Proxy running on http://localhost:3001');
});