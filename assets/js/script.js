const publicKey = "50c2738af8ba682b0bd1eb30113e85f8";
const privateKey = "e84660c817e3b2740008d45f4eb63dc6e0963518";

const generateHash = (timestamp, privateKey, publicKey) => {
    const hash = CryptoJS.MD5(timestamp + privateKey + publicKey).toString();
    return hash;
}

function getMarvelData(offset) {
    const timestamp = new Date().getTime().toString();
    const hash = generateHash(timestamp, privateKey, publicKey);
    const limit = 20;
    const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.data.results);
            renderHeroes(data.data.results);
            
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
console.log(getMarvelData(20));

const renderHeroes = (heroes) => {
    const heroesRow = document.getElementById("heroesRow");

    heroes.forEach(hero => {
        const { id, name, description, thumbnail } = hero;
        const { extension, path } = thumbnail;

        const divCol = document.createElement("div");
        divCol.classList.add("col-xl-3", "col-lg-3", "col-md-3", "col-sm-12", "col-xs-12", "mt-2", "mb-2");

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = `${path}.${extension}`;
        img.alt = `Image of ${name}`;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = name;

        const desc = document.createElement("p");
        desc.classList.add("card-text");
        desc.textContent = description || "No description available";

        const detailsBtn = document.createElement("button");
        detailsBtn.classList.add("details-btn");
        detailsBtn.textContent = "View Details";
        detailsBtn.addEventListener("click", () => showHeroDetails(hero));

        cardBody.appendChild(title);
        cardBody.appendChild(desc);
        cardBody.appendChild(detailsBtn);

        card.appendChild(img);
        card.appendChild(cardBody);

        divCol.appendChild(card);

        heroesRow.appendChild(divCol);
    });
}