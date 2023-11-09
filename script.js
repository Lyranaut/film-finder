function getTmdbApiKey() {
    return '1154c19df6e9cd079d723182248a57c3'; // Замени на свой API-ключ TMDB
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

function displayResult(result) {
    var resultContainer = document.getElementById('result');
    var releaseYear = getReleaseYear(result);
    var exFsLink = getExFsLink(result);
    var rezkaLink = getRezkaLink(result);
    var kinopoiskLink = getKinopoiskLink(result);
    var synopsis = result.overview || 'Информация отсутствует.';

    // Получаем рейтинг и ссылку на IMDb из объекта result
    var imdbRating = result.vote_average || 'Н/Д';
    var imdbLink = result.external_ids && result.external_ids.imdb_id ? `https://www.imdb.com/title/${result.external_ids.imdb_id}` : '';

    resultContainer.innerHTML = `
        <h2>${result.title || result.name} ${releaseYear ? `(${releaseYear})` : ''}</h2>
        <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title || result.name} Poster" class="movie-poster">
        ${releaseYear ? `<p><strong>Год выпуска:</strong> ${releaseYear}</p>` : ''}
        <p><strong>IMDb Рейтинг:</strong> <a href="${imdbLink}" target="_blank" class="imdb-link">${imdbRating}</a></p>
        <p><strong>Ex-Fs:</strong> <a href="${exFsLink}" target="_blank">${exFsLink}</a></p>
        <p><strong>Rezka:</strong> <a href="${rezkaLink}" target="_blank">${rezkaLink}</a></p>
        <p><strong>Kinopoisk:</strong> <a href="${kinopoiskLink}" target="_blank">${kinopoiskLink}</a></p>
        <p><strong>Синопсис:</strong> ${synopsis}</p>
    `;

    // Добавим обработчик клика для ссылки на IMDb
    var imdbElement = resultContainer.querySelector('.imdb-link');
    if (imdbElement && imdbLink) {
        imdbElement.addEventListener('click', function (event) {
            event.preventDefault();
            var newTab = window.open();
            newTab.opener = null;
            newTab.location.href = imdbLink;
        });
    }    
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

function getExFsLink(result) {
    // Здесь нужно добавить логику для формирования ссылки Ex-Fs
    return 'Ссылка';
}

function getRezkaLink(result) {
    // Здесь нужно добавить логику для формирования ссылки Rezka
    return 'Ссылка';
}

function getKinopoiskLink(result) {
    // Здесь нужно добавить логику для формирования ссылки Kinopoisk
    return 'Ссылка';
}

function displayRetryButton() {
    document.getElementById('retryButton').style.display = 'block';
}

function hideRetryButton() {
    document.getElementById('retryButton').style.display = 'none';
}