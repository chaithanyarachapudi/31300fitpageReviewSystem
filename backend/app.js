const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xxxxxxx', // put your MySQL password
  database: 'ratings_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connected');
});

app.post('/api/reviews', (req, res) => {
  const { product, rating, comment, username } = req.body;

  const checkSql = 'SELECT * FROM reviews WHERE product = ? AND username = ?';
  db.query(checkSql, [product, username], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    const insertSql = 'INSERT INTO reviews (product, rating, comment, username) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [product, rating, comment, username], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Review submitted successfully', id: result.insertId });
    });
  });
});


app.get('/api/reviews', (req, res) => {
  db.query('SELECT * FROM reviews', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
