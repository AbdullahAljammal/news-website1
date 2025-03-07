# News and Weather Fetching Web App

This project features a JavaScript function that fetches news articles and weather information. The application allows users to view articles in different categories (sports, technology, weather, and politics) and interact with them by liking and commenting on them. Additionally, users can check real-time weather data for any city.

## Features

- **Dynamic News Fetching:** 
  - Fetches news articles based on the current page's category (sports, technology, weather, or politics).
  - Utilizes [The Guardian API](https://open-platform.theguardian.com/documentation/) for news articles.
  - Allows users to load more articles dynamically.
  - Each article can be liked and commented on.

- **Interactive Comments System:**
  - Users can add comments on articles.
  - Comments are stored in the local storage and loaded upon request.

- **Weather Information Fetching:**
  - Real-time weather data fetched from the [OpenWeatherMap API](https://openweathermap.org/api).
  - Displays the current weather, including temperature, feels like temperature, and weather condition.

- **Like System:**
  - Articles can be liked, and the like count is saved in the local storage.

## How to Use

1. Clone or download the repository.
2. Open the `index.html` file in your browser.
3. Navigate through different pages (e.g., sports, technology, politics, weather) to view category-based news articles.
4. Like articles or add comments using the provided buttons.
5. Search for a city to get the current weather.

## Requirements

- JavaScript enabled browser (for full functionality)
- Working internet connection (for API requests)

## API Keys

- **News API:** [The Guardian API Key](https://content.guardianapis.com/) (You must replace the `newsApiKey` variable with your own key).
- **Weather API:** [OpenWeatherMap API Key](https://openweathermap.org/appid) (You must replace the `weatherApiKey` variable with your own key).

## Technologies Used

- JavaScript (ES6+)
- Fetch API
- Local Storage for comments and likes
- CSS for styling
- [The Guardian API](https://open-platform.theguardian.com/documentation/) for news
- [OpenWeatherMap API](https://openweathermap.org/api) for weather data

## How it Works

- The app fetches news articles based on the current page's category. The page is determined by the URL path.
- News articles are loaded dynamically, and users can like, comment, and view additional articles by clicking the "Load More" button.
- Weather information is fetched based on the city entered by the user in the weather input box.

