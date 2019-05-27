$(document).ready(function () {
    var params = new URLSearchParams(document.location.search.substring(1));
    var cardFullName = params.get('name').replace(/%20/g, " ");
    var setName = params.get("set").replace(/%20/g, " ");
    var host = "http://localhost:8080";
    var cardToLoad;
    var context = document.getElementById('myChart');

    $("title").text("MTG-BOARD " + cardFullName + " " + setName);

    getAndLoadCardByNameAndSetName();
    submitCard();


    $("#wantCard").click(function (e) {
        e.preventDefault();
        $("#wantedForm").toggle("fast");
    })

    $("#wantFilter").click(function (e) {
        $("#offerTable").find("tr[offerType='WANT']").css("display", "table-row");
        $("#offerTable").find("tr[offerType='SELL']").css("display", "none");

    })

    $("#sellFilter").click(function (e) {
        $("#offerTable").find("tr[offerType='WANT']").css("display", "none");
        $("#offerTable").find("tr[offerType='SELL']").css("display", "table-row");

    })

    function getAndLoadCardByNameAndSetName() {

        $.ajax({
            url: host + "/cards/name/set/" + cardFullName + "/" + setName,
            data: {},
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        }).done(function (result) {
            fillWebsiteWithCardData(result);
        }).fail(function () {
            postCardsByNameIntoDB();
        })
    }

    function fillWebsiteWithCardData(JsonCard) {
        var cardJson = JsonCard;
        $("#cardImage").append("<img src=" + cardJson.imageUrl + " alt=" + cardJson.name + " >")
        $('h4').append(cardJson.name);
        $('h6').append(cardJson.cardSet);
        $("#manaCost").append(cardJson.manaCost);
        $("#rarity").append(cardJson.rarity);
        $("#type").append(cardJson.type);
        $("#text").append(cardJson.text.replace(/\n/g, "<br />"));
        $("#flavor").append(cardJson.flavor);
        $("#cardId").val(cardJson.id);

        var languages = cardJson.languages.split(", ");
        for (var i = 0; i < languages.length; i++) {
            $("#languages").append("<option>" + languages[i] + "</option>")
        }

        getCardOffersByCardId(cardJson.id, offerTypeFilter);
        getPriceData(cardJson.id);
        getAvgPriceChart(cardJson.id);
    }
    function findCardBySetNameFromJSONArray(cardsArray, setName) {
        for (var i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i].set.name === setName) {
                return cardsArray[i];
            }
        }
    }
    function postCardsByNameIntoDB() {
        $.ajax({
            url: host + "/cards/name/" + cardFullName,
            data: {},
            type: "POST",
            dataType: "json",
            contentType: "application/json"
        }).done(function (result) {

            fillWebsiteWithCardData(findCardBySetNameFromJSONArray(result, setName));
        })
    }

    function submitCard() {
        $('#submitCard').click(function (e) {

            var host = "http://localhost:8080";
            e.preventDefault();
            var token = JSON.parse(sessionStorage.getItem("token"));

            var submittedCard = {
                "cardId": $('#cardId').val(),
                "quantity": $('#quantity').val(),
                "language": $('#languages').val(),
                "condition": $('#condition').val(),
                "comment": $('#comment').val(),
                "isFoiled": $('#isFoiled').prop("checked"),
                "isSigned": $('#isSigned').prop("checked"),
                "isAltered": $('#isAltered').prop("checked"),
                "price": $('#price').val(),
                "userId": token.userId,
                "wantedCard": $("#wanted").prop("checked"),
                "offeredCard": $("#offered").prop("checked")
            };
            $.ajax({
                url: host + "/user/cards",
                data: JSON.stringify(submittedCard),
                type: "POST",
                headers: {
                    "authId": token.userId,
                    "authToken": token.mtgAuthToken
                },
                xhrFields: {
                    withCredentials: true
                },
                // dataType: "json",
                contentType: "application/json",
                crossDomain: true,
            }).done(function (result, jqXHR, status) {
                alert("dodano kartę");
                getCardOffersByCardId(submittedCard.cardId, offerTypeFilter);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(submittedCard);
                console.log("nie dodano karty");
            })
        });


    }
    function getAvgPriceChart(id) {
        $.ajax({
            url: host + "/offers/history/" + id,
            data: {},
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        }).done(function (result) {
            drawChart(result, context);
        })
    }
    function fillCardOffers(array) {
        table = $("#offerTable");

        var wantMin = 0.00;
        var wantMinFoil = 0.00;
        var wantQuantity = 0;
        var sellMin = 0.00;
        var sellMinFoil = 0.00;


        for (var i = 0; i < array.length; i++) {

            table.append("<tr align='center' offerType=" + array[i].offerType + "></tr>");
            var row = table.find("tr").last();
            row.append("<td>" + array[i].userName + "</td>");
            row.append("<td>" + array[i].cardCondition + "</td>");

            if (array[i].foiled) {
                row.append("<td>FOIL</td>");
            } else {
                row.append("<td></td>");
            }

            row.append("<td>" + array[i].language + "</td>");
            row.append("<td>" + array[i].comment + "</td>");
            row.append("<td>" + array[i].price + "</td>");
            row.append("<td>" + array[i].quantity + "</td>");
            row.append("<td>" + "kontakt" + "</td>");

        }
    }

    function getCardOffersByCardId(id, callback) {

        $.ajax({
            url: host + "/offers/" + id,
            data: {},
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        }).done(function (result) {
            fillCardOffers(result);
            offerTypeFilter();
        })

        callback();
    }

    function offerTypeFilter() {
        if (!$("#wantFilter").prop("checked")) {
            $("#offerTable").find("tr[offerType='WANT']").css("display", "table-row");
            $("#offerTable").find("tr[offerType='SELL']").css("display", "none");
        } else {
            $("#offerTable").find("tr[offerType='WANT']").css("display", "none");
            $("#offerTable").find("tr[offerType='SELL']").css("display", "table-row");
        }
    }

    function getPriceData(id) {
        $.ajax({
            url: host + "/offers/prices/" + id,
            data: {},
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        }).done(function (result) {
            fillPriceData(result);
        })
    }

    function fillPriceData(prices) {
        $("#want-quantity").text(prices.wantQuantity);
        $("#want-min").text(prices.minWant);
        $("#want-avg").text(prices.avgWant);
        $("#want-foil-quantity").text(prices.wantFoilQuantity);
        $("#want-foil-min").text(prices.minFoilWant);
        $("#sell-quantity").text(prices.sellQuantity);
        $("#sell-min").text(prices.minSell);
        $("#sell-avg").text(prices.avgSell);
        $("#sell-foil-quantity").text(prices.sellFoilQuantity);
        $("#sell-foil-min").text(prices.minFoilSell);
    }

    function drawChart(pricesHistory, context) {

        var wantDates = mapValuesToArray(pricesHistory.wants)[0];
        var wantPrices = mapValuesToArray(pricesHistory.wants)[1];
        var sellDates = mapValuesToArray(pricesHistory.sells)[0];
        var sellPrices = mapValuesToArray(pricesHistory.sells)[1];

        var myChart = new Chart(context, {
            type: 'line',
            data: {
                labels: wantDates, //tablica dat generowana automatycznie
                datasets: [{
                    label: 'kupno',
                    data: wantPrices, //dane do zmapowania
                    fill: false,
                    borderWidth: 3,
                    borderColor: "lightskyblue",
                    lineTension: 0
                },
                {
                    label: 'sprzedaż',
                    data: sellPrices,
                    fill: false,
                    borderWidth: 3,
                    borderColor: "lightcoral",
                    lineTension: 0
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        // type: 'time',
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 31
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


    }

    function mapValuesToArray(DatesAndPricesArray) {
        var dates = [];
        var prices = [];
        for (var i = 0; i < DatesAndPricesArray.length; i++) {
            dates.push(DatesAndPricesArray[i].date);
            prices.push(DatesAndPricesArray[i].avgPrice);
        }

        return [dates, prices];
    }




})



