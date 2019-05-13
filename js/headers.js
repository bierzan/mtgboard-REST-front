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
        var cardToLoad;
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
                    // getAndLoadCardByNameAndSetName();
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

        ///////////// end of card queries
        function getAndLoadCardByNameAndSetName() {

            $.ajax({
                url: host + "/cards/name/set/" + cardFullName + "/" + setName,
                data: {},
                type: "GET",
                dataType: "json",
                contentType: "application/json"
            }).done(function (result) {
                sessionStorage.setItem('card', JSON.stringify(result));
                mainContent.empty();
                mainContent.load("./cardPage.html")
            }).fail(function () {
                postCardsByNameIntoDB();
            })
        }

        function postCardsByNameIntoDB() {
            $.ajax({
                url: host + "/cards/name/" + cardFullName,
                data: {},
                type: "POST",
                dataType: "json",
                contentType: "application/json"
            }).done(function (result) {
                findCardBySetNameFromJSONArray(result, setName);
                console.log(cardToLoad);
                sessionStorage.setItem('card', JSON.stringify(cardToLoad));
                mainContent.empty();
                mainContent.load("./cardPage.html")
            })
        }

        function findCardBySetNameFromJSONArray(cardsArray, setName) {
            for (var i = 0; i < cardsArray.length; i++) {
                if (cardsArray[i].set.name === setName) {
                    cardToLoad = cardsArray[i];
                }
            }
        }
    })

    $("#navigation").load("navbar.html", function () {
        var firstLink = $('#login-account');
        var secondLink = $('#register-logout');

        firstLink.text("Login");
        firstLink.attr("href", "./userLogin.html")
        secondLink.text("Register");
        secondLink.attr("href", "./userForm.html");

        if (checkIfTokenExists("user") === true) {
            firstLink.text("Profil");
            secondLink.text("Wyloguj");
            secondLink.on('click', function (e) {
                e.preventDefault();
                sessionStorage.removeItem('token');
                location.reload();
            })
        }

        function checkIfTokenExists(cookieName) {
            if (sessionStorage.getItem('token')!=null) {
                return true;
            }
            return false;
        }
    });
});



