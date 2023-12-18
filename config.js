const axios = require('axios');

axios.get('url_de_l_api')
  .then(response => {
    const data = response.data;
    // Traitez ici les données et insérez-les dans MariaDB
  })
  .catch(error => {
    console.error('Une erreur s’est produite lors de la récupération des données', error);
  });


  const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'votre_host',
  user     : 'votre_user',
  password : 'votre_mot_de_passe',
  database : 'votre_base_de_données'
});

connection.connect();


const insertData = (data) => {
    // Vous devrez construire votre requête SQL en fonction des données et de la structure de votre base
    const query = 'INSERT INTO votre_table SET ?';
    connection.query(query, data, (error, results, fields) => {
      if (error) throw error;
      // Traitez le résultat de l'insertion
    });
  };
  
  // Appelez insertData dans le .then() après avoir récupéré et traité vos données avec Axios
  
