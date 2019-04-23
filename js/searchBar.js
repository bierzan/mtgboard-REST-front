$(document).ready(function () {
    $("#searchHeader").load("searchBar.html" , function () {

        var searchBar = $('#cardNameSearch');
        var timeout = null;
        var RESTQueryDelay = 1000
        var suggestedCards = $('datalist');

        searchBar.on('keyup', function () {

            if (searchBar.val().length < 3) {
                suggestedCards.empty();
                return;
            }

            clearTimeout(timeout);
            timeout = setTimeout(function () {

                $.ajax({
                    url: "https://api.magicthegathering.io/v1/cards?name=" + searchBar.val(),
                    data: {},
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json"
                }).done(function (result) {
                    suggestedCards.empty();
                    getCardsByFractionalName(result);
                })

            }, RESTQueryDelay);

        })

        function getCardsByFractionalName(jsonArray) {

            for (var i = 0; i < jsonArray.cards.length; i++) {
                var option = $('<option>');
                var card = jsonArray.cards[i];
                var cardNameAndSet = card.name + " (" + card.set + ")";
                option.val(cardNameAndSet)
                option.attr("multiverseid", card.multiverseid);
                suggestedCards.append(option);
            }
        }
    })
});


