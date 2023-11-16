<?php
$tmdbApiKey = '1154c19df6e9cd079d723182248a57c3';
$movieDescription = urlencode($_GET['filmInput']);

$apiUrl = "https://api.themoviedb.org/3/search/movie?api_key={$tmdbApiKey}&query={$movieDescription}&language=ru-RU";

$response = file_get_contents($apiUrl);

$movieData = json_decode($response, true);

if (!$movieData || !isset($movieData['results'][0])) {
    $result = array(
        'title' => 'Фильм не найден',
        'year' => '',
        'director' => 'Информация отсутствует',
        'imdbLink' => '',
        'poster' => '',
        'synopsis' => '',
        'exFsLink' => '',
        'rezkaLink' => '',
        'kinopoiskLink' => '',
    );
} else {
    $firstResult = $movieData['results'][0];

    // Получаем информацию о режиссере
    $director = getDirector($firstResult['id']);
    
    $result = array(
        'title' => $firstResult['title'],
        'year' => $firstResult['release_date'] ? date('Y', strtotime($firstResult['release_date'])) : '',
        'director' => $director,
        'imdbLink' => $firstResult['external_ids']['imdb_id'] ? "https://www.imdb.com/title/{$firstResult['external_ids']['imdb_id']}" : '',
        'poster' => $firstResult['poster_path'] ? "https://image.tmdb.org/t/p/w500{$firstResult['poster_path']}" : '',
        'synopsis' => $firstResult['overview'],
        'exFsLink' => '',
        'rezkaLink' => '',
        'kinopoiskLink' => '', // Требуется дополнительная информация о фильме
    );
}

header('Content-Type: application/json');
echo json_encode($result);

// Функция для получения информации о режиссере
function getDirector($movieId) {
    global $tmdbApiKey;

    $creditsApiUrl = "https://api.themoviedb.org/3/movie/{$movieId}/credits?api_key={$tmdbApiKey}";
    $creditsResponse = file_get_contents($creditsApiUrl);
    $creditsData = json_decode($creditsResponse, true);

    if (isset($creditsData['crew'])) {
        foreach ($creditsData['crew'] as $crewMember) {
            if ($crewMember['job'] === 'Director') {
                return $crewMember['name'];
            }
        }
    }

    return 'Информация отсутствует';
}
?>
