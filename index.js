var makeUri, run, county;

makeUri = function(query, supplement) {
  return "http://search.twitter.com/search.json?rpp=100&q=" + query + "%20AND%20" + supplement;
};

county = function(array) {
  var i = 0;
  array.forEach(function(entry) {
    if (new Date() > Date.parse(entry.created_at) + 3600 * 1000 * 24)
          i++;
  });
  return i;
};

run = function(stock, done) {
  var negative, positive, trimToJson;
  positive = ["buy", "long", "bullish"];
  negative = ["sell", "short", "bearish"];
  uri = makeUri("$" + stock, positive.join("%20OR%20"));

  return $.ajax({
    url: uri,
    type: "GET",
    dataType: "jsonp"
  }).done(function(pdata) {

    return $.ajax({
      url: makeUri("$" + stock, negative.join("%20OR%20")),
      type: "GET",
      dataType: "jsonp"
    }).done(function(ndata) {
      return done({
        pcount: county(pdata.results),
        ncount: county(ndata.results),
        stock: stock
      });
    }).fail(function(err) {
      return console.log("fail on negative", err);
    });
  }).fail(function(err) {
    return console.log("fail on positive", err);
  });
};

$(function() {
  $('.stock-input').on("keypress", function(evt) {
    if (evt.charCode !== 13) return;

/*
    $('.loader').show();
    $results = $('#results').hide();
    */


    var symbol = $(this).val();
    // TODO find existing element

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
    }

    function makeUpdater(type) {
      var $el = $result.find("." + type);

      return function (){
        console.log(type);
        $el.html(++counts[type]);
      };

    }

    //var socket = io.connect('http://localhost:8010');
    var socket = io.connect('http://10.0.0.192:8010');
    socket.emit('follow', {symbol: "$" + symbol });
    socket.on('mention:$' + symbol, makeUpdater('mention'));
    socket.on('positive:$' + symbol, makeUpdater('positive'));
    socket.on('negative:$' + symbol, makeUpdater('negative'));

/*

    run($(this).val(), function(result) {
      console.log(result);
      $('.loader').hide();
      $results.find('.stock').html(result.stock);
      $results.find('.positive').html(result.pcount);
      $results.find('.negative').html(result.ncount);
      $results.show().removeClass("loading");
    });    
*/
  });
});