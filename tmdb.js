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
