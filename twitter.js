var twitter = require('ntwitter'),
    readline = require('readline');

var twit = new twitter({
    consumer_key: 'aOin6QDyOnRr1jHKeKjAA',
    consumer_secret: 'oGCM712TJcQQs01YYaEXBSISgqngsRH4iP1AaVMFQ',
    access_token_key: '19298368-A3GhWVXitjw0jOGugvDE9Vf3iLABR0lSpAzudDnX8',
    access_token_secret: 'R9syvhBkHUNHilO8S0R2JOKqiz9U7tdCLLm5Tdbxy4'
});

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter search query: ", function(answer) {
    var currentStream = twit.stream('statuses/filter', { 'track': answer }, function(stream) {
        stream.on('data', function (data) {
            var id = data.id;
            var text = data.text;
            var place = data.place;
            var geo = data.geo;
            var coordinates = data.coordinates;
            console.log(data);
        });
    });
});
