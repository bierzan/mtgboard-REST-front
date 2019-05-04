$(document).ready(function () {
    $("#searchHeader").load("searchBar.html", function () {

        var searchBar = $('#cardNameSearch');
        var timeout = 0;
        var RESTQueryDelay = 500;
        var suggestedCards = $('datalist');
        var submitBtn = $('#searchCard');
        var mainContent = $('#main');
        var cardFullName;
        var setCode;

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
                url: "http://localhost:8080/mtg/cards/name/like/" + searchBar.val(),
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
                    getAndLoadCardByNameAndSetFromAPI();
                })
                //submit button wywoluje get z bazy danych

            })
        }

///////////////////////////////////////////
        // function getCardsByPartialNameFromDB() {
        //     $.ajax({
        //         url: "http://localhost:8080/mtg/cards/name-part/" + searchBar.val(),
        //         data: {},
        //         type: "GET",
        //         dataType: "json",
        //         contentType: "application/json"
        //     }).done(function (result) {
        //         suggestedCards.empty();
        //         submitBtn.off('click');
        //         putCardsAsSearchOptions(result);
        //         //submit button wywoluje get z bazy danych
        //     }).fail(function (jqXHR, textStatus, errorThrown) {
        //         getCardsByPartialNameFromAPI();
        //     })
        // }
        // function getCardsByPartialNameFromAPI() {
        //     $.ajax({
        //         url: "https://api.magicthegathering.io/v1/cards?name=" + searchBar.val(),
        //         data: {},
        //         type: "GET",
        //         dataType: "json",
        //         contentType: "application/json"
        //     }).done(function (result) {
        //         suggestedCards.empty();
        //         submitBtn.off('click');//sprawdzic czy działa zdejmowanie eventu
        //         putCardsAsSearchOptions(result);

        //         submitBtn.click(function (event) {
        //             event.preventDefault();
        //             getCardNameAndSetFromSearchInput();
        //             getAndLoadCardByNameAndSetFromAPI();

        //         })
        //     })
        // }

        /////////////////////////
        function getCardNameAndSetFromSearchInput() {
            var searchInputValue = searchBar.val().split("(");
            cardFullName = searchInputValue[0].substring(0, searchInputValue[0].length - 1);
            setCode = searchInputValue[1].substring(0, searchInputValue[1].length - 1);
        }
        function putCardsAsSearchOptions(jsonArray) {

            for (var i = 0; i < jsonArray.length; i++) {
                var option = $('<option>');
                var card = jsonArray[i];
                var cardNameAndSet = card.name + " (" + card.set.name + ")";
                option.val(cardNameAndSet)
                option.attr("multiverseid", card.multiverseid);
                suggestedCards.append(option);
            }
        }
        function getAndLoadCardByNameAndSetFromAPI() {

            $.ajax({
                url: "https://api.magicthegathering.io/v1/cards?name=" + cardFullName + "&set=" + setCode,
                data: {},
                type: "GET",
                dataType: "json",
                contentType: "application/json"
            }).done(function (result) {
                localStorage.setItem('card', JSON.stringify(result.cards[0]));
                //zamienic local storag na save do bazy danych, a load ma wywoływac konkretną karte po multiverse id z DB
                mainContent.empty();
                mainContent.load("./cardPage.html")
            })
        }
    })

    $("#navigation").load("navbar.html", function () {
        var firstLink = $('#login-account');
        var secondLink = $('#register-logout');

        firstLink.text("Login");
        firstLink.attr("href", "http://google.pl")
        secondLink.text("Register");
        secondLink.attr("href", "./userForm.html");

        if (checkIfCookieExists("user") === true) {
            firstLink.text("Profil");
            secondLink.text("Wyloguj");
        }

        function checkIfCookieExists(cookieName) {
            var cookies = document.cookie;
            if (cookies.includes(" " + cookieName + "=")) {
                return true;
            }
            return false;
        }
    });
});



