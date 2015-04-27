var express = require('express');
var debug = require('debug')('api-server');
var Es      = require('elasticsearch');
var bodyParser = require('body-parser');

var app  = express();
var es   = new Es.Client({
  host: 'localhost:9200',
  apiVersion: '1.5'
});
var port = 6776;
var usersCount;
var postsCount;

app.use(bodyParser.json());

app.post('/posts', function(req, res){
  if(!postsCount) {
    es.count({
      index: 'blog',
      type: 'post'
    }, function(err, response, status) {
      postsCount = +response.count;
      postsCount += 1;

      es.create({
        index: 'blog',
        type: 'post',
        id: postsCount.toString(),
        body: req.body
      }, function (err, rspnse) {
        if(err) {
          return res.json(err);
        }

        res.json(rspnse);
      });
    });
  } else {
    postsCount += 1;
    es.create({
      index: 'blog',
      type: 'post',
      id: postsCount.toString(),
      body: req.body
    }, function (err, rspnse) {
        if(err) {
          return res.json(err);
        }

        res.json(rspnse);
    });
  }
});


app.get('/search', function (req, res) {
  var query = req.query;
  var opts = {
    index: 'blog',
    type: 'post',
    q: query.q
  };

  es.search(opts, function (err, response) {
    if(err) {
      res.json(err);
    }

    res.json(response);
  });
});

app.listen(port, function() {
  debug('search server running ' + port);
});
