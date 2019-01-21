$.when (
    $.getJSON('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000')
).done (function(data) {
    const $searchInput = $('input[type="search"]');
    const $results = $('.results');
    const $favourites = $('.favourites');
    let favourites = [];

    // when Enter is pressed act like button is pressed
    $searchInput.on('keyup', enterSearch);
    // when button is pressed search for values
    $('button').on('click', search);

    function enterSearch(event) {
        event.preventDefault();
        if(event.key === 'Enter') {
            $('button').click();
        }
    }

    function search() {
        const results = filterData();
        printResults(results);
    }

    function filterData() {
        let results = data;
        results = filterBySearch(results);
        return results;
    }

    function filterBySearch(data) {
        const searchedValues = $searchInput.val();
        // returns array of one element
        const arrSearchedValues = getSearchValue(searchedValues);

        return data.filter(el => {
            return arrSearchedValues.some(search => {
                return el.keywords.includes(search);
            });
        });
    }

    function getSearchValue(searchValues) {
        let arrSearchedValues = [];
        arrSearchedValues.push(searchValues);
        return arrSearchedValues;
    }

    function printResults(results) {
        // if the search box is empty then no results are visible
        if($searchInput.val() === '') {
            $results.empty();
        } else {
            $results.empty();
            results.forEach(printObject);

            $('.results p').on('click', storeFavourites); // store favourites and make p green
        }
    }

    function storeFavourites() {
        let results = getFavouritesDataValues($(this));

        if(results.length) {
            $('.favourites-section').show();
            $favourites.empty();
            results.forEach(printObjectFav);
        }
        $('.favourites div.row').on('click', deleteFavorite);
        return results;
    }

    function getFavouritesDataValues(addFavourite) {
        const resultsFavourites = getFavouriteValues(addFavourite);

        return data.filter(trash => {
            return resultsFavourites.some(fav => {
                return trash.title.includes(fav);
            });
        });
    }

    function printObject(result) {
        const resultBody = htmlEntities(result.body);
        $('<div class="col-sm-5">' +
            '<p><i class="fas fa-star"></i>' + result.title + '</p>' +
            '</div>' +
            '<div class="col-sm-7">' + resultBody + '</div>').appendTo($results);

    }

    function htmlEntities(string) {
        return String(string).replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;nbsp;/g,"&nbsp;")
    }

    function getFavouriteValues(favourite) {
        const item = favourite[0].textContent;
        const index = favourites.indexOf(item);
        if (index === -1) {
            favourites.push(favourite[0].textContent);
        }
        return favourites;
    }

    function printObjectFav(results) {
        const resultBody = htmlEntities(results.body);
        $('<div class="row">' +
            '<div class="col-sm-5">' +
            '<p><i class="fas fa-star green"></i>' + results.title + '</p>' +
            '</div>' +
            '<div class="col-sm-7">' + resultBody + '</div>' +
            '</div>').appendTo($favourites);
    }

    function deleteFavorite() {
        $(this).hide();
        const item = $(this)[0].childNodes[0].innerText;
        const index = favourites.indexOf(item);
        if (index !== -1) {
            favourites.splice(index, 1);
            $(this).empty();
            if(!favourites.length) {
                $('.favourites-section').hide();
            }
        }
    }
});