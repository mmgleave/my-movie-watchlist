// search button
var searchBtn = document.getElementById("search-btn");

// movie search input on click
// searchBtn.onsubmit = function search(event) {
//     event.preventDefault();
//     var movieTitle = document.getElementById("movie-title-input").value.trim();
//     var searchByTitle = movieTitle.replace(/\s/g, "+");

//     // fetch results
//     fetchSearchResults(searchByTitle);
// };

searchBtn.addEventListener('click', function (event) {
    event.preventDefault();

    var movieTitle = document.getElementById("movie-title-input").value.trim();
    var searchByTitle = movieTitle.replace(/\s/g, "+");

    // fetch results
    fetchSearchResults(searchByTitle);
});

// search results array (empty)
var searchResultsArray = [];

// find results array (empty)
var findResultsArray = [];

// search results container
var searchResultsContainer = document.getElementById("search-results-container");

// function to fetch results
var fetchSearchResults = function (searchByTitle) {
    fetch("http://www.omdbapi.com/?apikey=acd97009&type=movie&page=1&s=" + searchByTitle)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            // clear current search results
            searchResultsContainer.innerHTML = "";

            // loop through search results and add titles to search results array
            for (i = 0; i < response.Search.length; i++) {
                var newSearchResultTitle = response.Search[i].Title;
                searchResultsArray.push(newSearchResultTitle);
            };
            return [...new Set(searchResultsArray)];
        })
        // nested fetch using title search for  more detail for each search result
        .then(function (response) {
            // for each title in search results array from first search
            for (i = 0; i < response.length; i++) {
                fetch("http://www.omdbapi.com/?apikey=acd97009&type=movie&page=1&t=" + response[i])
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        // create a new object with details for each search result
                        var newSearchResultObj = {
                            title: response.Title,
                            year: response.Year,
                            rated: response.Rated,
                            actors: response.Actors,
                            director: response.Director,
                            genre: response.Genre,
                            plot: response.Plot,
                            posterURL: response.Poster,
                            writer: response.Writer,
                            imdb: response.imdbRating
                        };
                        // findResultsArray.push(newSearchResultObj);
                        if (newSearchResultObj.posterURL === "N/A" || newSearchResultObj.posterURL === null) {
                            console.log("no poster");
                        } else {
                            // create a new div for single result container
                            var resultContainer = document.createElement("div");
                            resultContainer.id = [i];

                            // create a new div for 1st row (title and year)
                            var titleRow = document.createElement("div");
                            var titleContent = document.createElement("h4");
                            titleContent.textContent = newSearchResultObj.title + " (" + newSearchResultObj.year + ")";
                            titleRow.append(titleContent);

                            // create a new div for 2nd row
                            var contentRow = document.createElement("div");

                            // create a new div to contain poster
                            var posterCol = document.createElement("div");
                            var posterImg = document.createElement("img");
                            posterImg.src = newSearchResultObj.posterURL;
                            posterCol.append(posterImg);

                            // create a new div to contain details
                            var detailsCol = document.createElement("div");
                            var detailsList = document.createElement("ul");
                            detailsList.style = "none";
                            var plotLi = document.createElement("li");
                            plotLi.textContent = newSearchResultObj.plot;
                            var directorLi = document.createElement("li");
                            directorLi.textContent = newSearchResultObj.director;
                            detailsList.append(plotLi, directorLi);
                            detailsCol.append(detailsList);

                            contentRow.append(posterCol, detailsCol)

                            // create a new row div to contain "add to watchlist" button
                            var buttonRow = document.createElement("div");
                            var addToWatchBtn = document.createElement("button");
                            addToWatchBtn.textContent = "Add to Watchlist";

                            // append all to result container
                            resultContainer.append(titleRow, contentRow);

                            // append result container to main container
                            searchResultsContainer.append(resultContainer);
                        }
                    });
                }
            })
            
};