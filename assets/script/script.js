// buttons
var searchBtn = document.getElementById("search-btn");
var searchTabBtn = document.getElementById("search-tab");
var watchlistsTabBtn = document.getElementById("lists-tab");

// search results arrays 
var searchResultsArray = [];
var findResultsArray = [];

// stored watch list
var storedWatchlist = JSON.parse(localStorage.getItem("watchlist"));

// watch list array
var watchlist = [];

// watched list array
var watchedList = [];

// containers
var searchFormContainer = document.getElementById("search-form-container");
var searchResultsContainer = document.getElementById("search-results-container");
var listsContainer = document.getElementById("lists-container");
var watchlistContainer = document.getElementById("watchlist-column");
var watchedContainer = document.getElementById("watched-column");

// search button click / submit
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();

    var movieTitle = document.getElementById("movie-title-input").value.trim();
    var searchByTitle = movieTitle.replace(/\s/g, "+");

    // fetch results
    fetchSearchResults(searchByTitle);
});

// add to watch list when add button clicked
var addToWatch = function (event) {
    var targetedID = event.target.id;
    var targetedResult = document.getElementById("title-" + targetedID);
    var titleToAdd = targetedResult.textContent;

    console.log(storedWatchlist);

    if(storedWatchlist === null){
        watchlist.push(titleToAdd);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    } else {
        watchlist = storedWatchlist;
        watchlist.push(titleToAdd);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
};

// remove from list when remove button clicked
var removeFromWatch = function(event){
    var targeted = event.target;
    console.log(targeted);
    
}

var createWatchlist = function (){
    if(storedWatchlist === null){
        watchlist = [];
    } else {watchlist = storedWatchlist};

    for (i = 0; i < watchlist.length; i++) {
        var watchlistItem = document.createElement("div");
        watchlistItem.classList.add("columns");
        var watchlistItemTitle = document.createElement("h4");
        watchlistItemTitle.textContent = watchlist[i];
        watchlistItemTitle.className = "column is-three-fifths";

        var watchedBtn = document.createElement("button");
        watchedBtn.textContent = "Watched";
        watchedBtn.className = "button is-info m-2"
        watchedBtn.addEventListener("click", addToWatched);

        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "button is-danger m-2"
        removeBtn.addEventListener("click", removeFromWatch);

        watchlistItem.append(watchlistItemTitle, watchedBtn, removeBtn);
        watchlistContainer.append(watchlistItem);
    };
};

var addToWatched = function(event){
    
}

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
                            // result container
                            var resultContainer = document.createElement("div");
                            resultContainer.classList.add("box");
                            resultContainer.id = "result-" + response.imdbID;

                            // 1st row (title and year)
                            var titleRow = document.createElement("div");
                            var titleContent = document.createElement("h4");
                            titleRow.classList.add("block");
                            titleContent.id = "title-" + newSearchResultObj.imdbID;
                            titleContent.textContent = newSearchResultObj.title + " (" + newSearchResultObj.year + ")";
                            titleRow.append(titleContent);

                            // 2nd row
                            var contentRow = document.createElement("div");
                            contentRow.classList.add("block");

                            // poster
                            var posterCol = document.createElement("div");
                            posterCol.classList.add("block");
                            var posterImg = document.createElement("img");
                            posterImg.src = newSearchResultObj.posterURL;
                            posterCol.append(posterImg);

                            // details of search result
                            var detailsCol = document.createElement("div");
                            var detailsList = document.createElement("ul");
                            detailsList.style = "none";
                            var genreLi = document.createElement("li");
                            genreLi.textContent = "Genre: " + newSearchResultObj.genre;
                            var plotLi = document.createElement("li");
                            plotLi.textContent = "Plot: " + newSearchResultObj.plot;
                            var directorLi = document.createElement("li");
                            directorLi.textContent = "Director: " + newSearchResultObj.director;
                            var actorsLi = document.createElement("li");
                            actorsLi.textContent = "Actors: " + newSearchResultObj.actors;

                            // *** add if here to only append if content is not N/A or null

                            detailsList.append(genreLi, plotLi, directorLi, actorsLi);
                            detailsCol.append(detailsList);

                            contentRow.append(posterCol, detailsCol)

                            // add to watchlist button
                            var buttonRow = document.createElement("div");
                            var addToWatchBtn = document.createElement("button");
                            addToWatchBtn.textContent = "Add to Watchlist";
                            addToWatchBtn.className = "add-btn button is-info";
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

// hide lists and show search when search tab is clicked
searchTabBtn.addEventListener("click", function(){
    searchFormContainer.style.display = "block";
    listsContainer.style.display = "none";
});

// hide search and show lists when lists tab it clicked
// generate watchlist from watchlist array
watchlistsTabBtn.addEventListener("click", function(){
    createWatchlist();
    searchFormContainer.style.display = "none";
    listsContainer.style.display = "block";
});