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
                    getAndLoadCardByNameAndSetName();
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
                var cardNameAndSet = card.name + " (" + card.set.name + ")";
                option.val(cardNameAndSet)
                option.attr("multiverseid", card.multiverseid);
                suggestedCards.append(option);
            }
        }
        function getAndLoadCardByNameAndSetName() {

            $.ajax({
                url: "http://localhost:8080/mtg/cards/name/set/" + cardFullName + "/" + setName,
                data: {},
                type: "GET",
                dataType: "json",
                contentType: "application/json"
            }).done(function (result) {
                localStorage.setItem('card', JSON.stringify(result));
                mainContent.empty();
                mainContent.load("./cardPage.html")
            }).fail(function(){
                postCardByNameAndSetNameIntoDB();
            }) 
        }

        function postCardByNameAndSetNameIntoDB(){
            $.ajax({
                url: "http://localhost:8080/mtg/cards/name/set/" + cardFullName + "/" + setName,
                data: {},
                type: "POST",
                dataType: "json",
                contentType: "application/json"
            }).done(function (result) {
                localStorage.setItem('card', JSON.stringify(result));
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



