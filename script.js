const searchBtn = document.getElementById("searchBtn");
const apiKey = config.apiKey;

function displayMovies(movies) {
    const results = document.getElementById("movieResults");
    results.innerHTML = "";

    movies.forEach(movie => {
        fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(details => {
                if (
                    details.Response === "False" ||
                    !details.Title ||
                    !details.Year ||
                    details.Poster === "N/A" ||
                    !details.Plot ||
                    details.Plot === "N/A"
                ) return;

                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");

                const title = document.createElement("h3");
                title.textContent = details.Title;                         

                const poster = document.createElement("img");
                poster.src = details.Poster !== "N/A"           
                    ? details.Poster
                    : "https://via.placeholder.com/150x225?text=No+Poster";
                poster.width = 150;
                poster.alt = `${details.Title} poster`;
                poster.onerror = () => movieCard.remove();

                const year = document.createElement("p");
                year.textContent = details.Year;

                const description = document.createElement("p");
                description.textContent = details.Plot || "No description available";

                const rating = document.createElement("p");
                rating.textContent = details.imdbRating !== "N/A"
                    ? `⭐ ${details.imdbRating} / 10`
                    : "Rating unavailable";

                movieCard.appendChild(title);
                movieCard.appendChild(poster);
                movieCard.appendChild(year);
                movieCard.appendChild(description);
                movieCard.appendChild(rating);
                results.appendChild(movieCard);
            })
            .catch(error => console.log("Error fetching details:", error)); 
        }); 
}                                                              
document.getElementById("movieInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBtn.click();
});
searchBtn.addEventListener("click", async () => {
    const movieName = document.getElementById("movieInput").value;
    const results = document.getElementById("movieResults");

    if (movieName.trim() === "") {
        alert("Please enter a movie name");
        return;
    }

    try {
        results.innerHTML = "<p>Loading...</p>";

        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(movieName)}&apikey=${apiKey}`); 
        const data = await response.json();

        if (data.Response === "False") {
            results.innerHTML = "<h2>No movies found</h2>";
            return;
        }

        displayMovies(data.Search);

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
});
