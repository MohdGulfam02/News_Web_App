
const API_KEY = "07cde8246bbe4e21884582bc459c0efc";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews("World"));

async function fetchNews(query){
    const response = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await response.json();
    console.log(data);
    bindData(data.articles);
}

function bindData(articles){
    // console.log(articles);
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    const pagination = document.getElementById('pagination');
    const pageSize = 9;
    let currentPage = 1;
    // Fetch news data from API and populate newsData array

    function displayNews(page) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedNews = articles.slice(startIndex, endIndex);

        // newsList.innerHTML = ''; // Clear previous news items
        cardsContainer.innerHTML = "";

        paginatedNews.forEach(article => {
              if(!article.urlToImage) return;
              const cardClone = newsCardTemplate.content.cloneNode(true);
              fillDataInCard(cardClone,article);
              cardsContainer.appendChild(cardClone);
        });

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        // console.log('inside pagination new fun');

        pagination.innerHTML = ''; // Clear previous pagination buttons
    
        const numPages = Math.ceil(articles.length / pageSize);
    
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('pagination-button');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayNews(currentPage);
            }
        });
        pagination.appendChild(prevButton);
    
        for (let i = 1; i <= numPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('pagination-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                displayNews(currentPage);
            });
            pagination.appendChild(button);
        }
    
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('pagination-button');
        nextButton.disabled = currentPage === numPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < numPages) {
                currentPage++;
                displayNews(currentPage);
            }
        });
        pagination.appendChild(nextButton);
    }
            
    // Assuming you have fetched news data and stored it in the newsData array
    // call displayNews(1) when the page loads to show the initial set of news
    displayNews(1);


}

function fillDataInCard(cardClone,article){
    const newsImage = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsDesc = cardClone.querySelector('#news-desc');
    const newsSource = cardClone.querySelector('#news-source');
    
    newsImage.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString('en-US',{
        timeZone:"Asia/Jakarta"
    });

    // const time = new Date(article.publishedAt).toLocaleTimeString();
    // const date = new Date(article.publishedAt).toLocaleDateString();

    cardClone.firstElementChild.addEventListener('click',()=>{
        window.open(article.url, "_blank")
    });

    newsSource.innerHTML = `${article.source.name} - ${date}`;
    // newsSource.innerHTML = `${article.source.name} - ${date} - ${time}`;
}

function reload(){
    window.location.reload();
}


const searchText = document.getElementById('search-text');
const searchBtn = document.getElementById('search-button');


let curSelectedNav = null;
function onNavItemClick(id){
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
    searchText.value='';
}

searchBtn.addEventListener('click', ()=>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
    searchText.value='';
})
