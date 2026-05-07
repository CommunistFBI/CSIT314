require('dotenv').config();
const app = require('./app');
const { seedDataIfEmpty } = require('./data/store');

const PORT = process.env.PORT || 5000;

seedDataIfEmpty();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
