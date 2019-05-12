$(document).ready(function () {
    var cardInfo = $('#cardInfo');
    var card = sessionStorage.getItem('card');

    var cardJson = JSON.parse(card);
    $("#cardImage").append("<img src="+cardJson.imageUrl+" alt=" + cardJson.name+" >")
    $('h3').append(cardJson.name);
    $('h5').append(cardJson.set.name);
    $("#manaCost").append(cardJson.manaCost);
    $("#rarity").append(cardJson.rarity);
    $("#type").append(cardJson.type);
    $("#text").append(cardJson.text.replace(/\n/g, "<br />"));
    $("#flavor").append(cardJson.flavor);
    
})