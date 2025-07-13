const apiKey = "09a550eb54cc74ae4643ac380deffd9d";
let page = 1;
let selectedGenre = null;
let isSearching = false;

const container = document.getElementById("movies-container");
const loadMoreBtn = document.getElementById("load-more");
const genresNav = document.getElementById("genres-nav");
const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");

const toggleGenresBtn = document.getElementById("toggle-genres");


toggleGenresBtn.addEventListener("click", () => {
  genresNav.classList.toggle("hidden");
});


async function fetchGenres() {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ar`);
  const data = await res.json();
  showGenres(data.genres);
}

function showGenres(genres) {
  const allBtn = document.createElement("button");
  allBtn.textContent = "الكل";
  allBtn.onclick = () => {
    selectedGenre = null;
    page = 1;
    container.innerHTML = "";
    fetchMovies();
  };
  genresNav.appendChild(allBtn);

  genres.forEach(genre => {
    const btn = document.createElement("button");
    btn.textContent = genre.name;
    btn.onclick = () => {
      selectedGenre = genre.id;
      page = 1;
      container.innerHTML = "";
      fetchMovies();
    };
    genresNav.appendChild(btn);
  });
}

async function fetchMovies() {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ar&page=${page}`;
  if (selectedGenre) {
    url += `&with_genres=${selectedGenre}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}

async function searchMovies(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ar&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  container.innerHTML = "";
  showMovies(data.results);
}

function showMovies(movies) {
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <a href="movie.html?id=${movie.id}" class="movie-link">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <div class="movie-content">
          <div class="movie-title">${movie.title}</div>
          <div class="movie-info">تاريخ الإصدار: ${movie.release_date || 'غير معروف'}</div>
          <div class="movie-info">التقييم: ⭐ ${movie.vote_average} (${movie.vote_count} صوت)</div>
          <div class="movie-info">${movie.overview.slice(0, 150)}...</div>
        </div>
      </a>
    `;
    container.appendChild(card);
  });
}


loadMoreBtn.addEventListener("click", () => {
  page++;
  fetchMovies();
});

searchIcon.addEventListener("click", () => {
  searchInput.style.display = searchInput.style.display === "block" ? "none" : "block";
  searchInput.focus();
});

searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value.trim();
  if (value.length > 2) {
    isSearching = true;
    searchMovies(value);
  } else if (value === "") {
    isSearching = false;
    container.innerHTML = "";
    fetchMovies();
  }
});

// البداية
fetchGenres();
fetchMovies();
