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
        $('h5').append(cardJson.set.name);
        $("#manaCost").append(cardJson.manaCost);
        $("#rarity").append(cardJson.rarity);
        $("#type").append(cardJson.type);
        $("#text").append(cardJson.text.replace(/\n/g, "<br />"));
        $("#flavor").append(cardJson.flavor);
        $("#cardId").val(cardJson.id);
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
        })
    }

    function findCardBySetNameFromJSONArray(cardsArray, setName) {
        for (var i = 0; i < cardsArray.length; i++) {
            if (cardsArray[i].set.name === setName) {
                cardToLoad = cardsArray[i];
            }
        }
    }

    function submitCard() {
        $('#submitCard').click(function (e) {
            
            var host = "http://localhost:8080";
            e.preventDefault();
            var token = JSON.parse(sessionStorage.getItem("token"));

            var submittedCard = {
                "cardId": $('#cardId').val(),
                "quantity": $('#quantity').val(),
                "language": $('#lang').val(),
                "condition": $('#condition').val(),
                "comment": $('#comment').val(),
                "isFoiled": $('#isFoiled').prop("checked"),
                "isSigned": $('#isSigned').prop("checked"),
                "isAltered": $('#isAltered').prop("checked"),
                "price": $('#price').val(),
            };
            $.ajax({
                url: host + "/users/cards/",
                data: JSON.stringify(submitCard),
                type: "POST",
                headers: {
                    "authId": token.userId,
                    "authToken": token.mtgAuthToken
                },
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                contentType: "application/json",
                crossDomain: true,
            }).done(function (result, jqXHR, status) {
                alert("dodano kartę");
                console.log(submitCard);
                // window.location.replace("./index.html");
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(submittedCard);
                console.log("nie dodano karty");
            })
        });


    }
})



