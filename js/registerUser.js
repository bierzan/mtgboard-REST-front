
$(document).ready(function () {
    
    registerUser();

})

function registerUser() {
    $('#registerUser').on('click', function (e) {
        var host = "http://localhost:8080";
        e.preventDefault();
        var user = {
            "username": $('#username').val(),
            "email": $('#email').val(),
            "password": $('#password').val(),
        };
        $.ajax({
            url: host + "/users/",
            data: JSON.stringify(user),
            type: "POST",
            xhrFields: {
                withCredentials: true
              },
            // dataType: "json",
            contentType: "application/json",
            crossDomain: true,
        }).done(function (result,jqXHR, status) {
            alert("zarejestrowano uzytkownika.\nZaloguj się jako nowy użytkownik");
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
