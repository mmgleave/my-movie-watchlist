// search button
var searchBtn = document.getElementById("search-btn");

// search results array (empty)
var searchResultsArray = [];

// find results array (empty)
var findResultsArray = [];

// watch list array
var watchlist = [];

// search results container
var searchResultsContainer = document.getElementById("search-results-container");

// lists container
var listsContainer = document.getElementById("lists-container");

// watchlist column
var watchlistContainer = document.getElementById("watchlist-column");

// watched column
var watchedContainer = document.getElementById("watched-column");

// search button click / submit
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();

    var movieTitle = document.getElementById("movie-title-input").value.trim();
    var searchByTitle = movieTitle.replace(/\s/g, "+");

    // fetch results
    fetchSearchResults(searchByTitle);
});

var addToWatch = function(event){
    var targetedID = event.target.id;
    var targetedResult = document.getElementById("title-" + targetedID);
    console.log(targetedResult);

    var titleToAdd = targetedResult.textContent;
    watchlist.push(titleToAdd);

    console.log(watchlist);
};

var createWatchlist = function(){
    for(i = 0; i < watchlist.length; i++){
        var watchlistItem = document.createElement("div");
        var watchlistItemTitle = document.createElement("h4");
        watchlistItemTitle.textContent = watchlist[i];
        
        var watchedBtn = document.createElement("button");
        watchedBtn.textContent = "Watched";
        watchedBtn.className = "button is-primary m-2"
        
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "button is-danger m-2"
        
        watchlistItem.append(watchlistItemTitle, watchedBtn, removeBtn);
        watchlistContainer.append(watchlistItem);
    }
};

// fetch search results
var fetchSearchResults = function (searchByTitle) {
    // empty out search results array to show only new
    searchResultsArray = [];

    // fetch from search api
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
                            actors: response.Actors,
                            director: response.Director,
                            genre: response.Genre,
                            plot: response.Plot,
                            posterURL: response.Poster,
                            writer: response.Writer,
                            imdb: response.imdbRating,
                            imdbID: response.imdbID
                        };

                        console.log(response);

                        if (newSearchResultObj.posterURL === "N/A" || newSearchResultObj.posterURL === null) {
                            console.log("no poster");
                        } else {
                            // create a new div for single result container
                            var resultContainer = document.createElement("div");
                            resultContainer.id = "result-" + response.imdbID;

                            // create a new div for 1st row (title and year)
                            var titleRow = document.createElement("div");
                            var titleContent = document.createElement("h4");
                            titleContent.id = "title-" + newSearchResultObj.imdbID;
                            titleContent.textContent = newSearchResultObj.title + " (" + newSearchResultObj.year + ")";
                            titleRow.append(titleContent);

                            // create a new div for 2nd row
                            var contentRow = document.createElement("div");

                            // create a new div to contain poster
                            var posterCol = document.createElement("div");
                            var posterImg = document.createElement("img");
                            posterImg.src = newSearchResultObj.posterURL;
                            posterCol.append(posterImg);

                            // create a new div to contain details (genre, plot, director, actors)
                            var detailsCol = document.createElement("div");
                            var detailsList = document.createElement("ul");
                            detailsList.style = "none";
                            var genreLi = document.createElement("li");
                            genreLi.textContent = newSearchResultObj.genre;
                            var plotLi = document.createElement("li");
                            plotLi.textContent = newSearchResultObj.plot;
                            var directorLi = document.createElement("li");
                            directorLi.textContent = newSearchResultObj.director;
                            // var writerLi = document.createElement("li");
                            // writerLi.textContent = newSearchResultObj.writer;
                            var actorsLi = document.createElement("li");
                            actorsLi.textContent = newSearchResultObj.actors;

                            // *** add if here to only append if content is not N/A or null

                            detailsList.append(genreLi, plotLi, directorLi, actorsLi);
                            detailsCol.append(detailsList);
                            
                            contentRow.append(posterCol, detailsCol)

                            // create a new row div to contain "add to watchlist" button
                            var buttonRow = document.createElement("div");
                            var addToWatchBtn = document.createElement("button");
                            addToWatchBtn.textContent = "Add to Watchlist";
                            addToWatchBtn.className = "add-btn button is-primary";
                            addToWatchBtn.id = response.imdbID;
                            addToWatchBtn.addEventListener("click", addToWatch);
                            buttonRow.append(addToWatchBtn);

                            // append all to result container
                            resultContainer.append(titleRow, contentRow, buttonRow);

                            // append result container to main container
                            searchResultsContainer.append(resultContainer);
                        }
                    });
                }
            })        
};

// call create watch list when watchlist button is clicked