var twitter = require('ntwitter'),
    _ = require('underscore'),
    io = require('socket.io').listen(8010);

var positive = ["buy", "long", "bullish"];
var negative = ["sell", "short", "bearish"];

var twit = new twitter({
    consumer_key: 'aOin6QDyOnRr1jHKeKjAA',
    consumer_secret: 'oGCM712TJcQQs01YYaEXBSISgqngsRH4iP1AaVMFQ',
    access_token_key: '19298368-A3GhWVXitjw0jOGugvDE9Vf3iLABR0lSpAzudDnX8',
    access_token_secret: 'R9syvhBkHUNHilO8S0R2JOKqiz9U7tdCLLm5Tdbxy4'
});

var symbols = [];

io.sockets.on('connection', function (socket) {
    console.log('new connection');

    socket.on('follow', function (data) {
        console.log('follow received.');

        symbols.push(data.symbol);

        twit.stream('statuses/filter', { 'track': symbols.join(',') }, function(stream) {
            stream.on('data', function (data) {
                var id = data.id;
                var text = data.text;
                var place = data.place;
                var geo = data.geo;
                var coordinates = data.coordinates;
                console.log(data);
                console.log('----------------------------------------');

                if (!text) {
                    return;
                }

                var matchedSymbol = _.first(symbols, function(sym) {
                    return text.indexOf(sym) > -1;
                });

                if (_.any(positive, function(p) {
                    return text.indexOf(p) > -1;
                })) {
                    socket.emit('positive:' + matchedSymbol, data);
                }

                if (_.any(negative, function(p) {
                    return text.indexOf(p) > -1;
                })) {
                    socket.emit('negative:' + matchedSymbol, data);
                }

                socket.emit('mention:' + matchedSymbol, data);
            });
        });
    });
});



