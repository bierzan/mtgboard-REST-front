$(document).ready(function () {
    var params = new URLSearchParams(document.location.search.substring(1));
    var cardFullName = params.get('name').replace(/%20/g, " ");
    var setName = params.get("set").replace(/%20/g, " ");
    var host = "http://localhost:8080";
    var cardToLoad;

    $("title").text("MTG-BOARD " + cardFullName + " " + setName);
    getAndLoadCardByNameAndSetName();

    $("#wantCard").click(function (e) {
        e.preventDefault();
        $("#wantedForm").toggle("fast");
    })

    submitCard();
    getChart();
    
    $("#wantFilter").click(function (e) {
        $("#offerTable").find("tr[offerType='WANT']").css("display", "table-row");
        $("#offerTable").find("tr[offerType='SELL']").css("display", "none");

    })

    $("#sellFilter").click(function (e) {
        $("#offerTable").find("tr[offerType='WANT']").css("display", "none");
        $("#offerTable").find("tr[offerType='SELL']").css("display", "table-row");

    })

    //////////////////////////

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
        $('h3').append(cardJson.name);
        $('h5').append(cardJson.setName);
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
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(submittedCard);
                console.log("nie dodano karty");
            })
        });


    }

    function getChart() {
        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], //tablica dat generowana automatycznie
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3], //dane do zmapowania
                    fill: false,
                    borderWidth: 3,
                    borderColor: "red",
                    lineTension: 0
                },
                {
                    label: '# of Votes',
                    data: [4, 5, 16, 40, 11, 3],
                    fill: false,
                    borderWidth: 3,
                    borderColor: "blue",
                    lineTension: 0
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    function fillCardOffers(array) {
        table = $("#offerTable");
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
            url: "http://localhost:8080/offers/" + id,
            data: {},
            type: "GET",
            dataType: "json",
            contentType: "application/json"
        }).done(function (result) {
            fillCardOffers(result); //wypelnienie tabeli z danymi ofert
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




})



