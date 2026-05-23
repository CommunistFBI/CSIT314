require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

pool.connect()
  .then(client => {
    client.release();
    console.log('Connected to PostgreSQL database.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err.message);
    console.error('Make sure DATABASE_URL is set in your .env file and the database is running.');
    process.exit(1);
  });
