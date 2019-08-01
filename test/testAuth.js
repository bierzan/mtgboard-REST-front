
$(document).ready(function () {
    test();

})

function test() {

    var host = "http://localhost:8080";

    $.ajax({
        url: host + "/test/counter/top/1",
        data: {},
        type: "GET",
        method: 'GET',
        dataType: "json",
        contentType: "application/json",


    })
        .done(function (data, textStatus, jqXHR, result) {
            var csrfToken = jqXHR.getResponseHeader('X-CSRF-TOKEN');

            if (csrfToken) {
                var cookie = JSON.parse($.cookie('helloween'));
                cookie.csrf = csrfToken;
                $.cookie('helloween', JSON.stringify(cookie));
            }

            $('p').text(JSON.stringify(result)); //DO ZMIANY
        }).fail(function (jqXHR, textStatus, errorThrown) {

            if (jqXHR.status === 401) { // HTTP Status 401: Unauthorized
                var cookie = JSON.stringify({ method: 'GET', url: '/', csrf: jqXHR.getResponseHeader('X-CSRF-TOKEN') });
                $.cookie('helloween', cookie);
                window.location = 'testLogin.html';
            } else {
                console.error('Houston, we have a problem...');
            }

        });
}
