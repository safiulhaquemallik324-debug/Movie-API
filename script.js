let apiKey = "98961895";

let searchBtn = document.getElementById("searchBtn");
let movieContainer = document.getElementById("movieContainer");
let movieInput = document.getElementById("movieInput");

/* =========================
   🔥 LIVE SEARCH (DEBOUNCE)
   ========================= */

let debounceTimer;

movieInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        searchMovie();
    }, 500);
});

/* =========================
   🔍 SEARCH BUTTON
   ========================= */

searchBtn.addEventListener("click", searchMovie);

/* =========================
   🎬 SEARCH MOVIE FUNCTION
   ========================= */

function searchMovie() {

    let movieName = movieInput.value.trim();

    if (movieName.length < 2) {
        movieContainer.innerHTML = "";
        return;
    }

    movieContainer.innerHTML = "<h3>Loading...</h3>";

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}`)
        .then(response => response.json())
        .then(data => {

            movieContainer.innerHTML = "";

            if (data.Response === "false") {
                movieContainer.innerHTML = "<h2>No movie found</h2>";
                return;
            }

            data.Search.forEach(movie => {
                let poster = movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300x450?text=No+Image";

                movieContainer.innerHTML += `
                <div class="movieCard" onclick="getMovieDetails('${movie.imdbID}')">
                    <img src="${poster}" alt="${movie.Title}">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
                `;
            });
        })
        .catch(error => {
            console.log(error);
            movieContainer.innerHTML = "<h2>Something went wrong</h2>";
        });
}


/* =========================
   🎥 GET MOVIE DETAILS
   ========================= */

function getMovieDetails(id) {
    movieContainer.innerHTML = "<h3>Loading details...</h3>";

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
        .then(res => res.json())
        .then(data => {
            showDetails(data);
        })
        .catch(err => console.log(err));
}


/* =========================
   📺 SHOW DETAILS UI
   ========================= */

function showDetails(movie) {

    let watchLinks = getWatchLinks(movie.Title);

    let watchHTML = watchLinks.map(link => {
        return `<a href="${link.url}" target="_blank" class="watchBtn">${link.name}</a>`;
    }).join(" ");

    movieContainer.innerHTML = `
      <div class="movieDetails">
        <img src="${movie.Poster}" />

        <div class="content">
          <h2>${movie.Title}</h2>

          <div class="meta">
            <span>${movie.Year}</span>
            <span>⭐ ${movie.imdbRating}</span>
            <span>${movie.Type}</span>
          </div>

          <p class="plot">${movie.Plot}</p>

          <div class="watch">
            <p>Watch on:</p>
            ${watchHTML}
          </div>

          <div class="actions">
            <button class="playBtn" onclick="playTrailer('${movie.Title}')">
              ▶ Play Trailer
            </button>

            <button class="backBtn">⬅ Back</button>
          </div>
        </div>
      </div>
    `;

    document.querySelector(".backBtn").addEventListener("click", () => {
        searchMovie();
    });
}


/* =========================
   🎥 TRAILER FUNCTION
   ========================= */

function playTrailer(title) {
    let query = encodeURIComponent(title + " trailer");
    let url = `https://www.youtube.com/results?search_query=${query}`;
    window.open(url, "_blank");
}


/* =========================
   🎌 ANIME DETECTION
   ========================= */

function isAnime(title) {
    title = title.toLowerCase();

    let animeKeywords = [
        "naruto", "one piece", "attack on titan", "demon slayer",
        "dragon ball", "jujutsu kaisen", "death note",
        "tokyo ghoul", "bleach", "chainsaw man", "vinland saga"
    ];

    return animeKeywords.some(keyword => title.includes(keyword));
}


/* =========================
   📺 WATCH LINKS FUNCTION
   ========================= */

function getWatchLinks(title) {

    let query = encodeURIComponent(title);

    let links = [
        { name: "Netflix", url: `https://www.netflix.com/search?q=${query}` },
        { name: "Prime Video", url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${query}` },
        { name: "Disney+ Hotstar", url: `https://www.hotstar.com/in/search?q=${query}` },
        { name: "Sony LIV", url: `https://www.sonyliv.com/search/${query}` },
        { name: "ZEE5", url: `https://www.zee5.com/search?q=${query}` },
        { name: "Apple TV+", url: `https://tv.apple.com/search?term=${query}` },
        { name: "Hulu", url: `https://www.hulu.com/search?q=${query}` },
        { name: "HBO Max", url: `https://www.max.com/search?q=${query}` },
        { name: "Lionsgate Play", url: `https://lionsgateplay.com/search?q=${query}` },
        { name: "YouTube", url: `https://www.youtube.com/results?search_query=${query}` }
    ];

    // 🔥 Anime hole extra add
    if (isAnime(title)) {
        links.push(
            { name: "Crunchyroll", url: `https://www.crunchyroll.com/search?query=${query}` },
            {
                name: "Aniwatch",
                url: `https://aniwatch.co.at/search?keyword=${query}`
            }
        );
    }

    return links;
}