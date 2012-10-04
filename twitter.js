var twitter = require('ntwitter'),
    io = require('socket.io');

io.listen(8010);

var twit = new twitter({
    consumer_key: 'aOin6QDyOnRr1jHKeKjAA',
    consumer_secret: 'oGCM712TJcQQs01YYaEXBSISgqngsRH4iP1AaVMFQ',
    access_token_key: '19298368-A3GhWVXitjw0jOGugvDE9Vf3iLABR0lSpAzudDnX8',
    access_token_secret: 'R9syvhBkHUNHilO8S0R2JOKqiz9U7tdCLLm5Tdbxy4'
});

var trackQuery = '';

io.sockets.on('connection', function (socket) {
    socket.on('follow', function (data) {
        trackQuery += ',' + data.symbol;

        twit.stream('statuses/filter', { 'track': trackQuery }, function(stream) {
            stream.on('data', function (data) {
                var id = data.id;
                var text = data.text;
                var place = data.place;
                var geo = data.geo;
                var coordinates = data.coordinates;

                socket.emit('mention', {});

                socket.emit('positive', {});

                socket.emit('negative', {});
            });
        });
    });
});



