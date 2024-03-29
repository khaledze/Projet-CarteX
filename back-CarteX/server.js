require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const bcrypt = require('bcrypt');
app.use(cors()); 
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
})

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }

  console.log('Connecté à la base de données MySQL');

  // Ici, vous pouvez exécuter vos requêtes SQL

  // Libérez la connexion après usage
  connection.release();
});

pool.on('error', (err) => {
  console.error('Erreur de pool de connexions:', err);
});

process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la pool de connexions:', err);
    }
    process.exit(0);
  });
});

app.get('/cartes', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const name = req.query.name;
  const type = req.query.type;
  const rarity = req.query.rarity;
  const sortPrice = req.query.sortPrice; // 'ASC' or 'DESC' for price sorting
  const sortAlphabetical = req.query.sortAlphabetical; // 'ASC' for alphabetical sorting

  let query = 'SELECT * FROM cartes';
  let queryParams = [];

  // Construct the WHERE clause if necessary
  let whereClauses = [];
  if (name) {
    whereClauses.push('nom LIKE ?');
    queryParams.push(`%${name}%`);
  }

  if (type) {
    if (type === 'Monster Card') {
      // Inclut toutes les cartes qui ne sont ni des Spell Cards ni des Trap Cards
      whereClauses.push("type NOT IN ('Spell Card', 'Trap Card')");
    } else {
      // Pour Spell Card et Trap Card, utilisez le type tel quel
      whereClauses.push('type = ?');
      queryParams.push(type);
    }
  }

  if (rarity) {
    whereClauses.push('set_rarity = ?');
    queryParams.push(rarity);
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  // Add sorting logic
  // Alphabetical sorting takes precedence if requested
  if (sortAlphabetical === 'ASC') {
    query += ' ORDER BY nom ASC';
  } else if (sortPrice) {
    // Price sorting if alphabetical sorting is not requested
    query += ' ORDER BY set_price ' + (sortPrice === 'DESC' ? 'DESC' : 'ASC');
  }

  // Add pagination
  query += ' LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    const [rows] = await connection.query(query, queryParams);
    await connection.end();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching cards from the database:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



app.get('/cartes/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const { id } = req.params;
    const [rows] = await connection.query('SELECT * FROM cartes WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Carte non trouvée' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la carte depuis la base de données:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/cartes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();

    await connection.query('DELETE FROM cartes WHERE id = ?', [id]);
    await connection.release();

    res.json({ message: 'Carte supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la carte depuis la base de données:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/cartes/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, type, description, image_url } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    await connection.query(
      'UPDATE cartes SET nom = ?, type = ?, description = ?, image_url = ? WHERE id = ?',
      [nom, type, description, image_url, id]
    );
    await connection.end();

    res.json({ message: 'Carte mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la carte dans la base de données:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/login', async (req, res) => {
    const { pseudo, mot_de_passe } = req.body;
  
    try {
      const [rows] = await connection.query('SELECT * FROM utilisateur WHERE pseudo = ?', [pseudo]);
  
      if (rows.length === 1) {
        const hashedPassword = rows[0].mot_de_passe;
  
        bcrypt.compare(mot_de_passe, hashedPassword, (err, result) => {
          if (result) {
            res.json({ success: true, message: 'Connexion réussie' });
          } else {
            res.status(401).json({ success: false, message: 'Identifiants incorrects' });
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Identifiants incorrects' });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
