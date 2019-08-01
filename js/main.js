$(document).ready(function () {
    var host = "http://localhost:8080";
    var topCards = $("#topCards");

    getTopSearchedCards(4);



    function getTopSearchedCards(limit) {
        $.ajax({
            url: host + "/cards/counter/top/" + limit,
            data: {},
            type: "GET",
            method: 'GET',
            // headers: {
            //     'Access-Control-Allow-Origin': '*'
            // },
            dataType: "json",
            contentType: "application/json",
        }).done(function (result) {
            fillMainPage(result);
        })
    }

    //window.location.href = './card.html?name=' + cardFullName + '&set=' + setName;

    function fillMainPage(cardsArray) {
        for (var i = 0; i < cardsArray.length; i++) {
            topCards.append("<div class=col-sm-3></div>");
            var col = topCards.find("div").last();
            col.append("<a href='./card.html?name=" + cardsArray[i].name + "&set=" + cardsArray[i].setName + "'>" + cardsArray[i].name + "</a>");
            col.append("<br>");
            col.append(cardsArray[i].setName);
            col.append("<br>");
            col.append(cardsArray[i].rarity);
            col.append("<br>");
            col.append("<img src=" + cardsArray[i].imageUrl + " alt=" + cardsArray[i].name + " style='width:223px ;heigth:310px'>");
            col.append("<br>");
            col.append("Średnia cena sprzedaży");
            col.append("<br>");
            col.append(cardsArray[i].avgSell);
            col.append("<br>");
            col.append("Srednia cena kupna");
            col.append("<br>");
            col.append(cardsArray[i].avgWant);
        }

    }
})



