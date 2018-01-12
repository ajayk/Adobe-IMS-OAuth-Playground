$(function () {
    'use strict';

    // initiate socket
    var socketUrl = window.location.protocol + '//' + window.location.host;
    var socket;


    socket = io.connect(socketUrl);
    socket.on('welcome', function () {
        console.log("connected!");
    });

    socket.on('message', function (msg) {
        if (msg.status == ('fail')) {
            $('.alert#' + msg.id).text(msg.text).show();
        }
    });

    socket.on('openUrl',function(link){
        var win=window.open(link.url);

    });

    function listen(uri) {
    }

    $("#consoleCredentials").submit(function (event) {

        $('.alert').hide();
        $("#authCode").val('');
        event.preventDefault();

        var authEndpoint = $("input#authEndpoint").val();
        var clientID = $("input#clientID").val();
        var scope = $("input#scope").val();

        socket.emit('getAuthCode', {authEndpoint: authEndpoint, clientID: clientID, scope: scope});
    });

    $("#tokenCredentials").submit(function (event) {

        $('.alert').hide();
        $("#accessToken").text("");
        $("#refreshToken").text("");

        event.preventDefault();

        var tokenEndpoint = $("input#tokenEndpoint").val();
        var clientSecret = $("input#clientSecret").val();
        var authCode = $("textarea#authCode").val();
        var clientID = $("input#clientID2").val();

        socket.emit('getAccessToken', {
            tokenEndpoint: tokenEndpoint,
            clientID: clientID,
            clientSecret: clientSecret,
            authCode: authCode
        });
    });

    socket.on('accessToken', function (body) {
        $('.alert').hide();

        if (body.access == undefined || body.refresh == undefined) {
            $(".alert#2").text("Something went wrong, please check the client secret, client id, authorization code and token endpoint URL").show();

        }
        else {

            $("#accessToken").text(body.access);
            $("#refreshToken").text(body.refresh);
            $("#authCode").val('');
            $(".alert#3").text("Tokens generated successfully!").show();
        }
    });
});