$(document).ready(function () {

    $("#navigation").load("navbar.html", function () {
        var firstLink = $('#login-account');
        var secondLink = $('#register-logout');

        firstLink.text("Login");
        firstLink.attr("href", "./userLogin.html")
        secondLink.text("Register");
        secondLink.attr("href", "./userForm.html");

        if (checkIfTokenExists("user") === true) {
            firstLink.text("Profil");
            secondLink.text("Wyloguj");
            secondLink.on('click', function (e) {
                e.preventDefault();
                sessionStorage.removeItem('token');
                location.reload();
            })
        }

        function checkIfTokenExists(cookieName) {
            if (sessionStorage.getItem('token')!=null) {
                return true;
            }
            return false;
        }
    });
});



