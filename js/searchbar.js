$(document).ready(function () {
    $("#searchHeader").load("searchBar.html", function () {

        var searchBar = $('#cardNameSearch');
        var timeout = 0;
        var RESTQueryDelay = 500;
        var suggestedCards = $('datalist');
        var submitBtn = $('#searchCard');
        var mainContent = $('#main');
        var cardFullName;
        var setName;
        var host = "http://localhost:8080";

        searchBar.on('keyup', function () {

            if (searchBar.val().length < 3) {
                suggestedCards.empty();
                return;
            }

            clearTimeout(timeout);
            timeout = setTimeout(getCardsByPartialName, RESTQueryDelay);
        })

        function getCardsByPartialName() {
            $.ajax({
                url: host + "/cards/name/like/" + searchBar.val(),
                data: {},
                type: "GET",
                dataType: "json",
                contentType: "application/json"
            }).done(function (result) {
                suggestedCards.empty();
                putCardsAsSearchOptions(result);
                submitBtn.off('click');
                submitBtn.click(function (event) {
                    event.preventDefault();
                    getCardNameAndSetFromSearchInput();
                    window.location.href ='./card.html?name=' + cardFullName + '&set='+ setName;
                })
            })
        }

        function getCardNameAndSetFromSearchInput() {
            var searchInputValue = searchBar.val().split("(");
            cardFullName = searchInputValue[0].substring(0, searchInputValue[0].length - 1);
            setName = searchInputValue[1].substring(0, searchInputValue[1].length - 1);
        }


        function putCardsAsSearchOptions(jsonArray) {

            for (var i = 0; i < jsonArray.length; i++) {
                var option = $('<option>');
                var card = jsonArray[i];
                var cardNameAndSet = card.name + " (" + card.setName + ")";
                option.val(cardNameAndSet)
                suggestedCards.append(option);
            }
        }
    })
});



