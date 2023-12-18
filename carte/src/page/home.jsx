document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

    const cardListElement = document.getElementById('cardList');
    fetch(apiUrl)
        .then(response => response.json()) // Convertit la réponse en JSON
        .then(data => {
            displayCardList(data.data);
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));

    function displayCardList(cardData) {
        const limitedCardData = cardData.slice(0, 300);
        const cardListHTML = limitedCardData.map(card => {
            return `<div>
                        <h3>${card.name}</h3>
                        <p>Type: ${card.type}</p>
                        <p>Attaque: ${card.atk}</p>
                        <p>Défense: ${card.def}</p>
                    </div>`;
        }).join('');
        cardListElement.innerHTML = cardListHTML;
    }
});
