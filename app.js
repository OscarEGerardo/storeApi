var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var models = require('./models');

var app = express();

app.set('port', 3000);

app.use(logger('dev'));
app.use(bodyParser.json());

models.sequelize.sync().then(function () {
    var server = app.listen(app.get('port'), function () {
        console.log('Listening on port 3000!');
    });
})


app.get('/', function (req, res) {
    res.send('StoreApi AgaveLab');
});


module.exports = app;