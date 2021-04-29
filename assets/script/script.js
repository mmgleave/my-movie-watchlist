// search button
var searchBtn = document.getElementById("search-btn");

// movie search input on click
searchBtn.onclick = function () {
    var movieTitle = document.getElementById("movie-title-input").value.trim();
    var searchByTitle = movieTitle.replace(/\s/g, "+");

    // fetch results
    fetchSearchResults(searchByTitle);
};

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
        })
        // nested fetch using title search for  more detail for each search result
        .then(function(response){
            // for each title in search results array from first search
            for(i = 0; i < searchResultsArray.length; i++){
                fetch("http://www.omdbapi.com/?apikey=acd97009&type=movie&page=1&t=" + searchResultsArray[i])
                .then(function(response) {
                return response.json()
                })
                .then(function(response){
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
                    }
                    findResultsArray.push(newSearchResultObj);
                })
            }
        })
        .then(function(response){
            for(i = 0; i < findResultsArray.length; i++){
                // add if to cancel if poster is not available
                if(findResultsArray[i].posterURL === "N/A" || findResultsArray[i].posterURL === null){
                    console.log("no poster");
                } else {
                    // create a new div for single result container
                    var resultContainer = document.createElement("div");
                    resultContainer.classList.add("box")
                    resultContainer.id = [i];

                    // create a new div for 1st row (title and year)
                    var titleRow = document.createElement("div");
                    titleRow.classList.add("block")
                    var titleContent = document.createElement("h4");
                    titleContent.textContent = findResultsArray[i].title + " (" + findResultsArray[i].year + ")";
                    titleRow.append(titleContent);

                    // create a new div for 2nd row
                    var contentRow = document.createElement("div");
                    contentRow.classList.add("block")
                    // create a new div to contain poster
                    var posterCol = document.createElement("div");
                    posterCol.classList.add("block")
                    var posterImg = document.createElement("img");
                    posterImg.src = findResultsArray[i].posterURL;
                    posterCol.append(posterImg);

                    // create a new div to contain details
                    var detailsCol = document.createElement("div");
                    var detailsList = document.createElement("ul");
                    detailsList.style = "none";
                    var plotLi = document.createElement("li");
                    plotLi.textContent = findResultsArray[i].plot;
                    var directorLi = document.createElement("li");
                    directorLi.textContent = findResultsArray[i].director;
                    detailsList.append(plotLi,directorLi);
                    detailsCol.append(detailsList);

                    contentRow.append(posterCol,detailsCol)
                    
                    // append all to result container
                    resultContainer.append(titleRow,contentRow);

                    // append result container to main container
                    searchResultsContainer.append(resultContainer);
                }
            }
        })
        };