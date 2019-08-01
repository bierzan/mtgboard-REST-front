
$(document).ready(function () {
    // loginUser();
    $('#loginUser').on('click', function (event) {



        event.preventDefault();
        var host = "http://localhost:8080";
        var cookie = JSON.parse($.cookie('helloween'));
        var data = 'username=' + $('#username').val() + '&password=' + $('#password').val();
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa($('#username').val() + ":" + $('#password').val()));
            },
            headers: { 'X-CSRF-TOKEN': cookie.csrf },
            timeout: 1000,
            type: 'POST',
            url: host + "/test/login"
        }).done(function (data, textStatus, jqXHR) {
            window.location = cookie.url;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error('Booh! Wrong credentials, try again!');
        });
    });

})

// $('#loginform').submit(function (event) {
//     event.preventDefault();
//     var cookie = JSON.parse($.cookie('helloween'));
//     var data = 'username=' + $('#username').val() + '&password=' + $('#password').val();
//     $.ajax({
//         data: data,
//         headers: { 'X-CSRF-TOKEN': cookie.csrf },
//         timeout: 1000,
//         type: 'POST',
//         url: host + "/test/login"
//     }).done(function (data, textStatus, jqXHR) {
//         window.location = cookie.url;
//     }).fail(function (jqXHR, textStatus, errorThrown) {
//         console.error('Booh! Wrong credentials, try again!');
//     });
// });

// function loginUser() {
//     $('#loginUser').on('click', function (e) {
//         var host = "http://localhost:8080";
//         e.preventDefault();
//         var user = {
//             "username": $('#username').val(),
//             "password": $('#password').val(),
//         };
//         $.ajax({
//             url: host + "/users/login",
//             data: JSON.stringify(user),
//             type: "POST",
//             xhrFields: {
//                 withCredentials: true
//             },
//             dataType: "json",
//             contentType: "application/json",
//             crossDomain: true,
//         }).done(function (result) {
//             alert("zalogowano uzytkownika.");
//             sessionStorage.setItem('token', JSON.stringify(result));
//             window.location.replace("./index.html");
//         }).fail(function (jqXHR, textStatus, errorThrown) {
//             var errors = jqXHR.responseJSON.errors;

//             var exceptionMessages = $('<div>');

//             for (var i = 0; i < errors.length; i++) {
//                 var exMessage = $('<p>');
//                 exMessage.text(errors[i]);
//                 exceptionMessages.append(exMessage);
//             }

//             $('body').prepend(exceptionMessages);
//         })
//     });
// }
