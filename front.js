var $ = require('jquery');
var request = require('browser-request');

var $createBtn  = $('#createBtn');
var $searchBtn =  $('#searchBtn');
var $createForm = $('#createForm');
var $searchForm = $('#searchForm');
var $results   =  $('#results');

$createBtn.on('click', createPost);
$searchBtn.on('click', searchTerm);

function createPost(evt) {
  var data = {
    author: $createForm.find('#author').val(),
    title: $createForm.find('#title').val(),
    body: $createForm.find('#body').val(),
    postDate: '2015-04-' + (new Date()).getDate()
  };

  request({
    method: 'POST',
    url: '/posts',
    json: true,
    body: data
  }, function(err, res, body) {
    if(err) {
      return console.dir(err);
    }

    if(body) {
      console.dir(body);
    }
  });
}

function searchTerm(evt){
  var qs = {
    q: $searchForm.find('#search').val().trim()
  };

  request({
    method: 'GET',
    url: '/search',
    qs: qs
  }, function (err, res, body) {
      var content;
      body = JSON.parse(JSON.parse(body));

      if(err || !body.hits.length){
        content = 'No results';

        $results.empty().text('No results found');
      }

      $results.empty();
      var nodes = [];
      var hits = body.hits.hits;

      hits.forEach(function iterate(h) {
        var header = $('<h4></h4').text(h._source.author);
        var title  = $('<h1></h1>').text(h._source.title);
        var body   = $('<p></p>').text(h._source.body);
        var node   = $('<div></div').css('width', '500px');

        node.append([title, header, body]);

        nodes.push(node);
      });

      $results.append(nodes);

      nodes = [];
  });
}
