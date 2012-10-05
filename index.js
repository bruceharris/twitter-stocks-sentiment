$(function() {
  $('.stock-input').on("keypress", function(evt) {
    if (evt.charCode !== 13) return;

    var symbol = $(this).val();

    $('#results').append('<div class="resultset sym-' + symbol + '"/>');
    var $result = $('#results .resultset.sym-' + symbol);

    $result.append('<div class="symbol"><strong>Symbol:</strong>  <img src=https://si0.twimg.com/a/1349296073/images/resources/twitter-bird-light-bgs.png><span> $' + symbol + '</span></symbol>');
    $result.append('<div>Mentions: <span class="mention"> </span> </div>');
    $result.append('<div>Positives: <span class="positive"></span> </div>');
    $result.append('<div>Negative: <span class="negative"></span> </div>');

    $(this).val('');    

    var counts = {
      mention: 0,
      positive: 0,
      negative: 0
    };

    function makeUpdater(type) {
      var $el = $result.find("." + type);

      return function() {
        $el.html(++counts[type]);
      };

    }

    var socket = io.connect('http://localhost:8010');
    socket.emit('follow', {symbol: "$" + symbol });
    socket.on('mention:$' + symbol, makeUpdater('mention'));
    socket.on('positive:$' + symbol, makeUpdater('positive'));
    socket.on('negative:$' + symbol, makeUpdater('negative'));

  });
});