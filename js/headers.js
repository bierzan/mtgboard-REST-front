$(document).ready(function () {
    $("#searchHeader").load("searchBar.html", function () {

        var searchBar = $('#cardNameSearch');
        var timeout = null;
        var RESTQueryDelay = 1000
        var suggestedCards = $('datalist');
        var submitBtn = $('#searchCard');
        var mainContent = $('#main');

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

        submitBtn.click(function(event){
            event.preventDefault();
            var inputValue = searchBar.val().split("(");
            console.log(inputValue);
            var cardFullName = inputValue[0].substring(0,inputValue[0].length-1);
            var setCode = inputValue[1].substring(0,inputValue[1].length-1);

            console.log(cardFullName);
            console.log(setCode);
            $.ajax({
                url: "https://api.magicthegathering.io/v1/cards?name=" + cardFullName+"&set="+setCode,
                data: {},
                type: "GET",
                dataType: "json",
                contentType: "application/json"
            }).done(function (result) {
                console.log(result);
                localStorage.setItem('card', JSON.stringify(result.cards[0]));
                mainContent.empty();
                mainContent.load("./cardPage.html")
            })
        })
    })

    $("#navigation").load("navbar.html", function(){
        var firstLink = $('#login-account');
        var secondLink = $('#register-logout');

        firstLink.text("Login");
        firstLink.attr("href", "http://google.pl")
        secondLink.text("Register");
        secondLink.attr("href", "./userForm.html");

        if (checkIfCookieExists("user")===true){
            firstLink.text("Profil");
            secondLink.text("Wyloguj");
        }

        function checkIfCookieExists(cookieName) {
            var cookies = document.cookie;
            if(cookies.includes(" " +cookieName + "=")){
                return true;
            }
            return false;
          }
    });
});



