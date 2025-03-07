const newsApiKey = "68afaf87-c809-4cf0-bdaf-674387374a0d";
let loadedArticles = new Set();
const apiKey = "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"; // Hugging Face API Key
let page = 1;

// Function to get the category based on the current page
function getPageCategory() {
    const pageName = window.location.pathname.split('/').pop();
    const categories = {
        "sports": "sport",
        "technology": "technology",
        "wether": "weather",
        "politics": "politics"
    };
    return categories[pageName.split('.')[0]] || 'news';
}

function fetchNews() {
    const category = getPageCategory();
    let url = `https://content.guardianapis.com/search?section=${category}&page=${page}&api-key=${newsApiKey}&show-fields=thumbnail,trailText`;

    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return response.json();
        })
        .then(data => data.response.results || [])
        .catch(error => {
            console.error("Error fetching news:", error);
            return [];
        });
}

// Function to handle liking an article
function likeArticle(articleId) {
    let likes = JSON.parse(localStorage.getItem("likes")) || {};
    likes[articleId] = (likes[articleId] || 0) + 1; // Increase like count
    localStorage.setItem("likes", JSON.stringify(likes));

    updateLikeCount(articleId);
}

// Function to update like count on the UI
function updateLikeCount(articleId) {
    let likes = JSON.parse(localStorage.getItem("likes")) || {};
    document.getElementById(`like-count-${articleId}`).innerText = likes[articleId] || 0;
}

// Function to add a comment
function addComment(articleId) {
    const commentInput = document.getElementById(`comment-input-${articleId}`);
    if (!commentInput.value.trim()) return; // Ignore empty comments

    let comments = JSON.parse(localStorage.getItem("comments")) || {};
    if (!comments[articleId]) {
        comments[articleId] = [];
    }
    comments[articleId].push(commentInput.value.trim());
    localStorage.setItem("comments", JSON.stringify(comments));

    commentInput.value = ""; // Clear input
    loadComments(articleId);
}

// Function to load comments
function loadComments(articleId) {
    let comments = JSON.parse(localStorage.getItem("comments")) || {};
    const commentsList = document.getElementById(`comments-${articleId}`);
    commentsList.innerHTML = ""; // Clear previous comments

    if (comments[articleId]) {
        comments[articleId].forEach(comment => {
            const commentItem = document.createElement("p");
            commentItem.innerText = comment;
            commentItem.classList.add("comment-item");
            commentsList.appendChild(commentItem);
        });
    }
}

// Function to toggle comment visibility
function toggleComments(articleId) {
    const commentContainer = document.getElementById(`comment-container-${articleId}`);
    if (commentContainer.style.display === "none") {
        commentContainer.style.display = "block";
        loadComments(articleId); // Load comments when opened
    } else {
        commentContainer.style.display = "none";
    }
}

// Function to load and display news
async function loadMoreNews() {
    const newsList = document.getElementById("news-list");
    const loadMoreButton = document.getElementById("load-more-button");
    if (!newsList || !loadMoreButton) return;

    loadMoreButton.disabled = true;
    loadMoreButton.innerText = "Loading...";

    try {
        const articles = await fetchNews();

        if (articles.length === 0) {
            loadMoreButton.innerText = "No more news available";
            return;
        }

        let newArticlesLoaded = false;
        articles.forEach(article => {
            if (!loadedArticles.has(article.webUrl)) {
                loadedArticles.add(article.webUrl);
                newArticlesLoaded = true;
                
                const articleId = encodeURIComponent(article.webUrl);
                const newsItem = document.createElement("div");
                newsItem.classList.add("news-item");
                newsItem.innerHTML = `
                    ${article.fields?.thumbnail ? `<img src="news-image.jpg" alt="${article.webTitle}" class="news-image"/>` : '<img src="news-image.jpg" alt="${article.webTitle}" class="news-image"/>'}
                    <a href="${article.webUrl}" target="_blank">${article.webTitle}</a>
                    <p>${article.fields?.trailText || "No description available."}</p>
                    <button class="like-button" onclick="likeArticle('${articleId}')">
                        <i class="fa-regular fa-thumbs-up"></i> <span id="like-count-${articleId}">0</span>
                    </button>
                    <button class="see-comments-button" onclick="toggleComments('${articleId}')">See Comments</button>
                    <div class="comment-container" id="comment-container-${articleId}" style="display: none;">
                        <input type="text" id="comment-input-${articleId}" placeholder="Write a comment..."/>
                        <button onclick="addComment('${articleId}')">Post</button>
                        <div id="comments-${articleId}" class="comments-list"></div>
                    </div>
                `;
                newsList.appendChild(newsItem);
                updateLikeCount(articleId);
                loadComments(articleId);
            }
        });

        page++; // Always increment page to try next results
        loadMoreButton.disabled = false;
        loadMoreButton.innerText = "Load More";

        if (!newArticlesLoaded) {
            // If no new articles, try next page automatically
            setTimeout(() => loadMoreNews(), 500);
        }
    } catch (error) {
        console.error("Error loading news:", error);
        loadMoreButton.innerText = "Error loading news";
    }
}

// Initialize with DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("news-list")) {
        loadMoreNews();
    }

    document.getElementById("load-more-button")?.addEventListener("click", loadMoreNews);
});

// Fetch weather data function remains unchanged
function fetchWeather() {
    const city = document.getElementById('weather-search').value.trim();
    const weatherApiKey = '31110a1b75b5f894f60f863a40cdf6f8'; // Replace with your OpenWeatherMap API key

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherInfo = document.getElementById('weather-info');

            if (data.cod === 200) {
                const weatherCondition = data.weather[0].main.toLowerCase();
                const temp = Math.round(data.main.temp);
                const feelsLike = Math.round(data.main.feels_like);
                const updatedTime = new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Europe/Bucharest'
                }) + ' EET';

                let stickerClass = 'weather-sticker ';
                if (weatherCondition.includes('clear')) {
                    stickerClass += 'sun';
                } else if (weatherCondition.includes('cloud')) {
                    stickerClass += 'cloud';
                } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
                    stickerClass += 'rain';
                }
                
                weatherInfo.innerHTML = `
                    <div class="weather-main">
                        <div class="${stickerClass.trim()}"></div>
                        <div class="temperature-section">
                            <div class="current-temp">${temp}°C</div>
                            <div class="weather-meta">
                                <div class="feels-like">Feels like ${feelsLike}°C</div>
                                <div class="update-time">Updated ${updatedTime}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                weatherInfo.innerHTML = '<div class="weather-error">City not found</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = '<div class="weather-error">Error fetching weather</div>';
        });
}
