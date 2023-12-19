


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../img/yu.png';
import './Home.css';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const cardsPerPage = 20;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Construire l'URL avec les paramètres de recherche et de filtrage
        const params = new URLSearchParams({
          page: currentPage,
          limit: cardsPerPage,
          name: searchTerm,
          type: filterType
        });
  
        const res = await axios.get(`http://localhost:3001/cartes?${params.toString()}`);
        console.log("Réponse de l'API:", res.data);
        setCards(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes", error);
      }
    };
  
    fetchCards();
  }, [currentPage, searchTerm, filterType]);

  const handlePreviousClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div>      
      <header className="header">
        <div className="logo">
          <img src={Logo} alt="Logo" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="search-and-filter">
        <input
          type="text"
          className="input"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="Spell Card">Spell Card</option>
          <option value="Monster Card">Monster Card</option>
        
        </select>
      </div>
      </header>
      <div className="container">
        <div className="cards-grid">
        {cards.map(card => (
  <div className="card" key={card.id}>
    <img src={card.image_url} alt={card.nom} />
    <h3>{card.nom}</h3>
    <p>Type: {card.type}</p>
    <p>Race: {card.race}</p>
    <p>Set Name: {card.set_name}</p>
    <p>Set Rarity: {card.set_rarity}</p>
    
    {card.type === "Spell Card" ? (
      <>
        <p>Frame Type: {card.frameType}</p>
        <p>Description: {card.description}</p>
      </>
    ) : (
      
      <>
        <p>ATK: {card.atk}</p>
        <p>DEF: {card.def}</p>
        <p>Level: {card.level}</p>
        <p>Attribute: {card.attribute}</p>
      </>
    )}
  </div>
))}


        </div>
        <div className="pagination">
          <button onClick={handlePreviousClick} disabled={currentPage === 1}>Précédent</button>
          <button onClick={handleNextClick}>Suivant</button>
        </div>
      </div>
    </div>
  );
}