const axios = require('axios');
const mysql = require('mysql2/promise');

async function fetchDataFromAPI() {
  try {
    const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php');
    const cardData = response.data.data;
    await insertDataIntoDatabase(cardData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données depuis l\'API:', error);
  }
}

async function insertDataIntoDatabase(cardData) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1Aqzsedrf!',
    database: 'yugi',
  });

  try {
    for (const card of cardData) {
      await connection.query('INSERT INTO cartes (nom, type, description, image_url) VALUES (?, ?, ?, ?)', [
        card.name,
        card.type,
        card.desc,
        card.card_images[0].image_url,
      ]);
    }

    console.log('Données insérées avec succès dans la base de données.');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données dans la base de données:', error);
  } finally {
    await connection.end();
  }
}
fetchDataFromAPI();
