$(document).ready(function () {
    var cardInfo = $('#cardInfo');
    var card = localStorage.getItem('card');
    console.log(card);

    var cardJson = JSON.parse(card);

    console.log(cardJson.name);
    cardInfo.append(cardJson.name);
    cardInfo.append("<br>");
    cardInfo.append(cardJson.set);
    cardInfo.append("<div><img src="+cardJson.imageUrl+" alt=" + cardJson.name+" >")
    
})