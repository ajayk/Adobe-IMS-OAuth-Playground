// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var request = require('request');

var port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));
app.get(['/', '/handler'], function (req, res, next) {


    if (req.query.code !== undefined) {
        var code = req.query.code;
        res.cookie('authCode', code);
        res.cookie('clientId', consoleClientID);
    }

    res.redirect('..');


});


server.listen(port);

var consoleClientID, consoleClientSecret, consoleAuthCode, consoleAccessToken, consoleAuthURL, consoleTokenURL,
    consoleScopes;


io.on('connection', function (socket) {
    socket.emit('welcome', {});
    socket.emit('getCookie', {});


    socket.on('getAuthCode', function (consoleCredentials) {

        consoleClientID = consoleCredentials.clientID;
        consoleAuthURL = consoleCredentials.authEndpoint;
        consoleScopes = consoleCredentials.scope;

        var url = consoleAuthURL + "?response_type=code&client_id=" + consoleClientID + "&scope=" + consoleScopes;
        socket.emit('openUrl', {url: url});
    });

    socket.on('getAccessToken', function (tokenCredentials) {

        consoleTokenURL = tokenCredentials.tokenEndpoint;
        consoleClientID = tokenCredentials.clientID;
        consoleClientSecret = tokenCredentials.clientSecret;
        consoleAuthCode = tokenCredentials.authCode;
        var grant_type = "authorization_code";

        var accessTokenOptions = {
            method: 'POST',
            url: consoleTokenURL,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            formData: {
                client_id: consoleClientID,
                client_secret: consoleClientSecret,
                code: consoleAuthCode,
                grant_type: grant_type

            }
        };

        try {
            request(accessTokenOptions, function (error, response, body) {
                if (error) {
                    throw error;
                }

                if (response.statusCode == 200) {
                    var token = JSON.parse(body).access_token;
                    var refresh = JSON.parse(body).refresh_token;

                    socket.emit('accessToken', {access: token, refresh: refresh, clientId:consoleClientID});
                }
                else {
                    socket.emit('message', {
                        status: 'fail',
                        text: "Something went wrong, please check the client secret, client id, authorization code and token endpoint URL",
                        id: 2
                    });
                }


            });
        }
        catch (err) {
            socket.emit('message', {
                status: 'fail',
                text: "Something went wrong, please check the client secret, client id, authorization code and token endpoint URL",
                id: 2
            });
        }


    });

});
