// buttons
var searchBtn = document.getElementById("search-btn");
var searchTabBtn = document.getElementById("search-tab");
var watchlistsTabBtn = document.getElementById("lists-tab");

// search results arrays 
var searchResultsArray = [];
var findResultsArray = [];

// stored watch list
var storedWatchlist = JSON.parse(localStorage.getItem("watchlist"));

// stored watched list
var storedWatchedList = JSON.parse(localStorage.getItem("watchedList"));

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

// hide lists on load
window.onload = function () {
    listsContainer.style.display = "none";
}

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
    event.target.textContent = "(Added)"

    if (storedWatchlist === null) {
        watchlist.push(titleToAdd);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    } else {
        watchlist = storedWatchlist;
        watchlist.push(titleToAdd);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
};

// create watched list
var createWatchedList = function () {
    // clear out
    watchedContainer.innerHTML = "";

    if (storedWatchedList === null) {
        watchedList = [];
    } else { watchedList = storedWatchedList };

    for (i = 0; i < watchedList.length; i++) {
        // container
        var watchedItemContainer = document.createElement("div");
        watchedItemContainer.className = "box m-2"

        var watchedItem = document.createElement("div");
        watchedItem.className = "columns";
        var watchedItemTitle = document.createElement("h4");
        watchedItemTitle.textContent = watchedList[i].title;
        watchedItemTitle.className = "column is-three-fifths";

        var reviewBtn = document.createElement("button");
        reviewBtn.textContent = "Review";
        reviewBtn.className = "button is-info is-small is-outlined m-2"
        reviewBtn.addEventListener("click", review);

        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "button is-danger is-small is-outlined m-2"
        removeBtn.addEventListener("click", removeFromWatched);

        var userReview = document.createElement("p");
        userReview.className = "m-2 mt-4 is-size-6 has-text-info";
        userReview.textContent = watchedList[i].review;

        watchedItem.append(watchedItemTitle, reviewBtn, removeBtn);
        watchedItemContainer.append(watchedItem, userReview);
        watchedContainer.prepend(watchedItemContainer);
    };
};

// create watch list (on page load)
var createWatchlist = function () {
    // clear out
    watchlistContainer.innerHTML = "";

    // loop through stored data to produce list and add each item
    if (storedWatchlist === null || storedWatchlist.length === 0) {
        watchlist = [];
    } else { watchlist = storedWatchlist };

    for (i = 0; i < watchlist.length; i++) {
        var watchlistItem = document.createElement("div");
        watchlistItem.className = "columns box m-2";
        var watchlistItemTitle = document.createElement("h4");
        watchlistItemTitle.textContent = watchlist[i];
        watchlistItemTitle.className = "column is-three-fifths";

        var watchedBtn = document.createElement("button");
        watchedBtn.textContent = "Watched";
        watchedBtn.className = "button is-info is-small is-outlined m-2"
        watchedBtn.addEventListener("click", addToWatched);

        var removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "button is-danger is-small is-outlined m-2"
        removeBtn.addEventListener("click", removeFromWatch);

        watchlistItem.append(watchlistItemTitle, watchedBtn, removeBtn);
        watchlistContainer.prepend(watchlistItem);
    };
};

// remove item from watch list and move to watched lsit
var addWatchedItem = function (newTitle) {
    // container
    var watchedItemContainer = document.createElement("div");
    watchedItemContainer.className = "box m-2"

    // title and year, review btn, delete btn
    var watchedItem = document.createElement("div");
    watchedItem.className = "columns";
    var watchedItemTitle = document.createElement("h4");
    watchedItemTitle.textContent = newTitle;
    watchedItemTitle.className = "column is-three-fifths";
    var reviewBtn = document.createElement("button");
    reviewBtn.textContent = "Review";
    reviewBtn.className = "button is-info is-small is-outlined m-2"
    reviewBtn.addEventListener("click", review);
    var removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "button is-danger is-small is-outlined m-2"
    removeBtn.addEventListener("click", removeFromWatched);

    // review content
    var reviewRow = document.createElement("div");
    var reviewHeader = document.createElement("h4");
    reviewHeader.textContent = "User Review:";
    reviewHeader.className = "is-size-5 ml-2 mt-4 has-text-info";
    var reviewForm = document.createElement("form");
    reviewForm.className = "columns ml-1 mr-1 mt-4"
    var reviewTextArea = document.createElement("textarea");
    reviewTextArea.className = "column is-four-fifths textarea is-info is-small";
    reviewTextArea.placeholder = "(Add your review here)."
    var reviewSubmitBtn = document.createElement("button");
    reviewSubmitBtn.textContent = "Submit"
    reviewSubmitBtn.className = "button is-small is-info is-outlined m-2"
    reviewSubmitBtn.addEventListener("click", submitReview);
    reviewForm.append(reviewTextArea);
    reviewRow.append(reviewForm, reviewSubmitBtn);

    // append
    watchedItem.append(watchedItemTitle, reviewBtn, removeBtn);
    watchedItemContainer.append(watchedItem, reviewHeader, reviewRow);
    watchedContainer.prepend(watchedItemContainer);
};

// add to watched list array
var addToWatched = function (event) {
    var targeted = event.target;
    var targetedDiv = targeted.parentElement;
    var targetedTitle = targetedDiv.children[0].textContent;
    var targetedReview = "";
    var targetedObj = { title: targetedTitle, review: targetedReview };

    for (i = 0; i < watchlist.length; i++) {
        if (targetedTitle === watchlist[i]) {
            watchlist.splice(i, 1);
            i--;

            if (storedWatchedList === null || storedWatchedList.length === 0) {
                watchedList.push(targetedObj);
            } else {
                watchedList = storedWatchedList;
                watchedList.push(targetedObj);
            };

            targetedDiv.remove();
            localStorage.setItem("watchlist", JSON.stringify(watchlist));
            localStorage.setItem("watchedList", JSON.stringify(watchedList));

        } else {
            console.log("no match");
        };
    };

    addWatchedItem(targetedTitle);
};

// remove from watched list when remove button clicked
var removeFromWatched = function (event) {
    var targetedDiv = event.target.parentElement;
    var targetedTitle = targetedDiv.children[0].textContent;

    for (i = 0; i < watchedList.length; i++) {
        if (watchedList[i].title === targetedTitle) {
            watchedList.splice(i, 1);
            i--;
            targetedDiv.parentElement.remove();
        } else {
            console.log("do nothing");
        }
    }

    localStorage.setItem("watchedList", JSON.stringify(watchedList));
};

// remove from watchlist when remove button clicked
var removeFromWatch = function (event) {
    var targetedDiv = event.target.parentElement;
    var targetedTitle = targetedDiv.children[0].textContent;
    console.log(watchlist);

    for (i = 0; i < watchlist.length; i++) {
        if (watchlist[i] === targetedTitle) {
            watchlist.splice(i, 1);
            i--;
            targetedDiv.remove();
        } else {
            console.log("do nothing");
        }
    };

    localStorage.setItem("watchlist", JSON.stringify(watchlist));
};

// review button
var review = function (event) {
    var targetedDiv = event.target.parentElement.parentElement;

    var reviewRow = document.createElement("div");
    var reviewHeader = document.createElement("h4");
    reviewHeader.textContent = "User Review:";
    reviewHeader.className = "is-size-5 ml-2 mt-4 has-text-info";
    var reviewForm = document.createElement("form");
    reviewForm.className = "columns ml-1 mr-1 mt-4"
    var reviewTextArea = document.createElement("textarea");
    reviewTextArea.className = "column is-four-fifths textarea is-info is-small";
    event.target.disabled = true;

    var targetedReview = targetedDiv.children[1];
    targetedReview.style.display = "none";

    reviewTextArea.placeholder = "(Add your review here)."
    var reviewSubmitBtn = document.createElement("button");
    reviewSubmitBtn.textContent = "Submit"
    reviewSubmitBtn.className = "button is-small is-info is-outlined m-2"
    reviewSubmitBtn.addEventListener("click", submitReview);
    reviewForm.append(reviewTextArea);
    reviewRow.append(reviewForm, reviewSubmitBtn);

    targetedDiv.append(reviewHeader, reviewRow);

    reviewTextArea.focus();
}

// submit review (on button click)
var submitReview = function (event) {
    event.preventDefault();

    var userReviewInput = event.target.parentElement.children[0].children[0].value;
    var targetedDiv = event.target.parentElement.parentElement;

    // add p tag for user input
    var newUserReview = document.createElement("p");
    var reviewInputDiv = event.target.parentElement;
    newUserReview.className = "m-2 mt-4 is-size-6 has-text-info";
    newUserReview.textContent = userReviewInput;

    reviewInputDiv.style.display = "none";
    targetedDiv.append(newUserReview);

    // add review to local storage for item
    var targetedTitle = targetedDiv.children[0].children[0].textContent;

    for(i = 0; i < storedWatchedList.length; i++){
        if(targetedTitle === storedWatchedList[i].title) {
            storedWatchedList[i].review = userReviewInput;
            console.log(storedWatchedList[i]);

            localStorage.setItem("watchedList", JSON.stringify(storedWatchedList));
            console.log(localStorage.getItem("watchedList"));
        } else {
            console.log("error: no match");
        }
    };
};

// fetch search results from omdb
var fetchSearchResults = function (searchByTitle) {
    // empty out search results array to show only new
    searchResultsArray = [];
    findResultsArray = [];

    // fetch from search api
    fetch("https://www.omdbapi.com/?apikey=acd97009&type=movie&page=1&s=" + searchByTitle)
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
                fetch("https://www.omdbapi.com/?apikey=acd97009&type=movie&page=1&t=" + response[i])
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

                        if (newSearchResultObj.posterURL === "N/A" || newSearchResultObj.posterURL === null) {
                        } else {
                            // result container
                            var resultContainer = document.createElement("div");
                            resultContainer.classList.add("box");
                            resultContainer.id = "result-" + response.imdbID;

                            // 1st row (title and year)
                            var titleRow = document.createElement("div");
                            var titleContent = document.createElement("h4");
                            titleRow.classList.add("block");
                            titleRow.classList.add("is-size-4")
                            titleContent.id = "title-" + newSearchResultObj.imdbID;
                            titleContent.textContent = newSearchResultObj.title + " (" + newSearchResultObj.year + ")";
                            titleRow.append(titleContent);

                            // 2nd row
                            var contentRow = document.createElement("div");
                            contentRow.classList.add("block");
                            contentRow.classList.add("columns");

                            // poster
                            var posterCol = document.createElement("div");
                            posterCol.className = "block column is-one-third";
                            var posterImg = document.createElement("img");
                            posterImg.src = newSearchResultObj.posterURL;
                            posterCol.append(posterImg);

                            // details of search result
                            var detailsCol = document.createElement("div");
                            detailsCol.classList.add("column")
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

                            detailsList.append(genreLi, plotLi, directorLi, actorsLi);
                            detailsCol.append(detailsList);

                            contentRow.append(posterCol, detailsCol)

                            // add to watchlist button
                            var addToWatchBtn = document.createElement("button");
                            addToWatchBtn.textContent = "Add to Watchlist";
                            addToWatchBtn.className = "add-btn button is-info mt-5";
                            addToWatchBtn.id = response.imdbID;
                            addToWatchBtn.addEventListener("click", addToWatch);
                            detailsCol.append(addToWatchBtn);

                            // append all to result container
                            resultContainer.append(titleRow, contentRow);

                            // append result container to main container
                            searchResultsContainer.append(resultContainer);
                        }
                    });
            }
        })
};

function render(title, averageVotes, releaseDate) {
    renderTitle(title);
    renderAverageVotes(averageVotes, data.averageVotes);
    releaseDate(releaseDate, data.releaseDate);
}

fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=f23e2048f00b4587198656f119cb73f4")
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        //render (title, averageVotes, releaseDate);
        console.log(json);
    })
    .catch(function (error) {
        console.error(error);
    });

// hide lists and show search when search tab is clicked
searchTabBtn.addEventListener("click", function () {
    searchFormContainer.style.display = "block";
    listsContainer.style.display = "none";
});

// hide search and show lists when lists tab it clicked
// generate watchlist from watchlist array
watchlistsTabBtn.addEventListener("click", function () {
    createWatchlist();
    createWatchedList();
    searchFormContainer.style.display = "none";
    listsContainer.style.display = "block";
});