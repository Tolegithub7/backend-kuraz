const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskmanager')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// // Swagger and Routes (keep existing code)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/tasks', taskRoutes);
// app.use('/auth', authRoutes);

// Serve Swagger JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Serve Swagger UI with persisted auth
app.use('/api-docs', swaggerUi.serve, (req, res) => {
  const swaggerHtml = swaggerUi.generateHTML(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true  // Persists auth token across refreshes
    }
  });
  res.send(swaggerHtml);
});

// Only enable Swagger in non-production environments
if (process.env.NODE_ENV !== 'production') {
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  app.use('/api-docs', swaggerUi.serve, (req, res) => {
    const swaggerHtml = swaggerUi.generateHTML(swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true
      }
    });
    res.send(swaggerHtml);
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
