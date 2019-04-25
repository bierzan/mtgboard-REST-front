
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
        })
    });
}
