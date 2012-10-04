var exports, makeUri, run, county;

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

    run($(this).val(), function(result) {
      console.log(result);
    });    
  });
});