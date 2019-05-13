$(document).ready(function () {
    var params = new URLSearchParams(document.location.search.substring(1));
    var cardFullName = params.get('name').replace(/%20/g," ");
    
    var setName = params.get("set").replace(/%20/g," ");
    var host = "http://localhost:8080";
    var cardToLoad;

    getAndLoadCardByNameAndSetName();

    // var card = sessionStorage.getItem('card');

    function getAndLoadCardByNameAndSetName() {

        $.ajax({
            url: host + "/cards/name/set/" + cardFullName + "/" + setName,
            data: {},
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        }).done(function (result) {
            fillWebsiteWithCardData(result);
            // sessionStorage.setItem('card', JSON.stringify(result));
            // mainContent.empty();
            // mainContent.load("./cardPage.html")
        }).fail(function () {
            postCardsByNameIntoDB();
        })
    }
    function fillWebsiteWithCardData(JsonCard) {
        var cardJson = JsonCard;
        $("#cardImage").append("<img src=" + cardJson.imageUrl + " alt=" + cardJson.name + " >")
        $('h3').append(cardJson.name);
        $('h5').append(cardJson.set.name);
        $("#manaCost").append(cardJson.manaCost);
        $("#rarity").append(cardJson.rarity);
        $("#type").append(cardJson.type);
        $("#text").append(cardJson.text.replace(/\n/g, "<br />"));
        $("#flavor").append(cardJson.flavor);
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
            fillWebsiteWithCardData(cardToLoad);
            // console.log(cardToLoad);
            // sessionStorage.setItem('card', JSON.stringify(cardToLoad));
            // mainContent.empty();
            // mainContent.load("./cardPage.html")
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



