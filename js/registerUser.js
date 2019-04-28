
$(document).ready(function () {
    registerUser();

})

function registerUser() {
    $('#registerUser').on('click', function (e) {
        e.preventDefault();
        var user = {
            "username": $('#username').val(),
            "email": $('#email').val(),
            "password": $('#password').val(),
        };
        $.ajax({
            url: "http://localhost:8080/mtg/users/",
            data: JSON.stringify(user),
            type: "POST",
            // dataType: "json",
            contentType: "application/json"
        }).done(function (result) {
            alert("zarejestrowano uzytkownika");
            window.location.replace("./index.html");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            var errors = jqXHR.responseJSON.errors;

            var exceptionMessages = $('<div>');

            for (var i = 0; i < errors.length; i++) {
                var exMessage = $('<p>');
                exMessage.text(errors[i]);
                exceptionMessages.append(exMessage);
            }

            $('body').prepend(exceptionMessages);
        })
    });
}
