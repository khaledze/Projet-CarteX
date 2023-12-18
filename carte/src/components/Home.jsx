


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../img/yu.png';
import './Home.css';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/cartes?page=${currentPage}&limit=${cardsPerPage}`);
        console.log("Réponse de l'API:", res.data); 
        setCards(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes", error);
      }
    };

    fetchCards();
  }, [currentPage]);

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
        <div className="main">
                    <input required type="text" className="input" />
                    <label>
                        <span style={{transitionDelay: '0ms', left: '0px'}}>U</span>
                        <span style={{transitionDelay: '75ms', left: '20px'}}>s</span>
                        <span style={{transitionDelay: '150ms', left: '33px'}}>e</span>
                        <span style={{transitionDelay: '225ms', left: '47px'}}>r</span>
                        <span style={{transitionDelay: '300ms', left: '56px'}}>n</span>
                        <span style={{transitionDelay: '375ms', left: '72px'}}>a</span>
                        <span style={{transitionDelay: '450ms', left: '85px'}}>m</span>
                        <span style={{transitionDelay: '525ms', left: '110px'}}>e</span>
                        <p style={{position: 'absolute', left: '-8px', top: '-10px', fontSize: '24px', margin: '10px', color: 'gray', transition: '0.5s', pointerEvents: 'none'}}>Username</p>
                    </label>
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