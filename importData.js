require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3001;

app.get('/cartes', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    const [rows] = await connection.query('SELECT * FROM cartes');
    await connection.end();

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes depuis la base de données:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
