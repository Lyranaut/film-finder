function getTmdbApiKey() {
    return '1154c19df6e9cd079d723182248a57c3';
}

function searchMedia(movieDescription) {
    var tmdbApiKey = getTmdbApiKey();
    var apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${movieDescription}&language=ru-RU`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                return data.results[0];
            } else {
                return null;
            }
        });
}

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var movieDescription = document.getElementById('filmInput').value;

    // Отправляем запрос на TMDB API
    searchMedia(movieDescription)
        .then(result => {
            if (result) {
                displayResult(result);
                addToSearchHistory(result);
            } else {
                displayRetryButton();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayRetryButton();
        });
});

document.getElementById('retryButton').addEventListener('click', function () {
    hideRetryButton();
    document.getElementById('result').innerHTML = '';
    document.getElementById('filmInput').value = '';
});

document.addEventListener('DOMContentLoaded', function () {
    var searchHistory = getSearchHistory();
    window.searchHistory = searchHistory;

    updateSearchHistoryUI(searchHistory);
});

function addToSearchHistory(result) {
    var searchHistory = window.searchHistory || [];
    var newItem = {
        title: result.title || result.name,
        year: getReleaseYear(result),
        director: result.director || '',
    };
    searchHistory.push(newItem);
    window.searchHistory = searchHistory;

    updateSearchHistoryUI(searchHistory);

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function getSearchHistory() {
    var searchHistoryString = localStorage.getItem('searchHistory');
    return searchHistoryString ? JSON.parse(searchHistoryString) : [];
}

function updateSearchHistoryUI(searchHistory) {
    var historyContainer = document.getElementById('searchHistory');
    historyContainer.innerHTML = '<h2>История поиска</h2>';

    var recentSearches = searchHistory.slice(-3);
    recentSearches.forEach(function (search, index) {
        var searchItem = document.createElement('div');
        searchItem.innerHTML = `<p class="search-item" data-search="${search.title}">${search.title} (${search.year}) - ${search.director}</p>`;
        historyContainer.appendChild(searchItem);
    });

    var searchItems = document.getElementsByClassName('search-item');
    Array.from(searchItems).forEach(function (searchItem) {
        searchItem.addEventListener('click', function () {
            var movieDescription = searchItem.getAttribute('data-search');
            searchMedia(movieDescription)
                .then(result => {
                    if (result) {
                        displayResult(result);
                    } else {
                        displayRetryButton();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    displayRetryButton();
                });
        });
    });
}

function getReleaseYear(result) {
    if (result.media_type === 'movie' && result.release_date) {
        return new Date(result.release_date).getFullYear();
    } else if (result.media_type === 'tv' && result.first_air_date) {
        return new Date(result.first_air_date).getFullYear();
    } else {
        return null;
    }
}

function displayResult(result) {
    var resultContainer = document.getElementById('result');
    var releaseYear = getReleaseYear(result);
    var synopsis = result.overview || 'Информация отсутствует.';

    resultContainer.innerHTML = `
        <h2>${result.title || result.name} ${releaseYear ? `(${releaseYear})` : ''}</h2>
        <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title || result.name} Poster" class="movie-poster">
        ${releaseYear ? `<p><strong>Год выпуска:</strong> ${releaseYear}</p>` : ''}
        <p><strong>Синопсис:</strong> ${synopsis}</p>
        <p><strong>Режиссер:</strong> ${result.director || 'Информация отсутствует.'}</p>

        <button id="trailerButton">Смотреть трейлер</button>
        <div id="trailer"></div>
    `;

    updateSearchHistoryUI(window.searchHistory);

    document.getElementById('trailerButton').addEventListener('click', function () {
        displayTrailer(result.title || result.name, getReleaseYear(result));
    });
}

function displayRetryButton() {
    document.getElementById('retryButton').style.display = 'block';
}

function hideRetryButton() {
    document.getElementById('retryButton').style.display = 'none';
}

function displayTrailer(movieTitle, releaseYear) {
    getYouTubeTrailer(movieTitle, releaseYear)
        .then(videoId => {
            if (videoId) {
                var trailerContainer = document.getElementById('trailer');
                trailerContainer.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                `;
                
                trailerContainer.style.display = 'block';

                var trailerButton = document.getElementById('trailerButton');
                trailerButton.style.display = 'none';

            } else {
                console.error('Трейлер не найден');
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке трейлера:', error);
        });
}
