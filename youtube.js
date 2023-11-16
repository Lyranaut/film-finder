// Полный код для youtube.js
function getYouTubeApiKey() {
    return 'AIzaSyDQZCofewCuSX5zslr4GWEn2ncKaPBXuKI';
}

function getYouTubeTrailer(movieTitle, releaseYear) {
    var youtubeApiKey = getYouTubeApiKey();
    var apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle} ${releaseYear} trailer&maxResults=1&type=video&key=${youtubeApiKey}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                return data.items[0].id.videoId;
            } else {
                return null;
            }
        });
}
