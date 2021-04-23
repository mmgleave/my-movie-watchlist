var searchBtn = document.getElementById("search-btn");

searchBtn.onclick = function(){
    // add if to eliminate bad searches or blank searches in input
    // add if to eliminate searches without a poster listed?

    // movie title input
    var movieTitle = document.getElementById("movie-title-input").value.trim();

    // update with + instead of space
    var searchByTitle = movieTitle.replace(/\s/g, "+");

    // fetch from omdb (general search for multiple responses)
    fetch("http://www.omdbapi.com/?apikey=acd97009&type=movie&page=1&s=" + searchByTitle)
        // response
        .then(function(response){
            return response.json()
        })
        // then append search results
        .then(function(response){            
            // container to append to
            var searchResultsContainer = document.getElementById("search-results-container");

            // clear current search results from container
            searchResultsContainer.innerHTML = "";

            // array for search results
            var searchResultsArray = [];

            // add an if here for response.response = true

            // loop through search results and add to array
            for(i=0; i < response.Search.length; i++){
                var newSearchResultObj = {
                    i: [i],
                    filmTitle: response.Search[i].Title,
                    releaseDate: response.Search[i].Year,
                    posterURL: response.Search[i].Poster,
                }
                searchResultsArray.push(newSearchResultObj);
            }
            
            console.log(searchResultsArray);

            // add objects in search results array to results container
            for(i=0; i < searchResultsArray.length; i++){
                // search result div
                var searchResult = document.createElement("div");
                searchResult.id = "search-result-" + [i];
                searchResult.className = "column"

                // title eleement h4
                var searchResultTile = document.createElement("h4");
                searchResultTile.textContent = searchResultsArray[i].filmTitle;

                // year element p
                var searchResultYear = document.createElement("h4");
                searchResultYear.textContent = searchResultsArray[i].releaseDate;

                // poster element img
                var searchResultPoster = document.createElement("img");
                searchResultPoster.src = searchResultsArray[i].posterURL;
                
                // append to search result
                searchResult.append(searchResultPoster);
                searchResult.append(searchResultTile);
                searchResult.append(searchResultYear);

                // append to container
                searchResultsContainer.append(searchResult);
            }
            // clear search input
            document.getElementById("movie-title-input").value = "";

            // clear search results array and erase results from container
            searchResultsArray = [];
        })
    }