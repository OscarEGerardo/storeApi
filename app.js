var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var models = require('./models');

var products = require('./routes/products');

var app = express();

app.set('port', 3000);

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/products', products);

models.sequelize.sync().then(function () {
    var server = app.listen(app.get('port'), function () {
        console.log('Listening on port 3000!');
    });
})

app.use(function(err, req, res, next) {
    var responseData;
    if (err.name === 'JsonSchemaValidation') {
        res.status(400);
 
        responseData = {
           statusText: 'Bad Request',
           jsonSchemaValidation: true,
           validations: err.validations   
        };
        res.json(responseData);
    } else {
        next(err);
    }
});

app.get('/', function (req, res) {
    res.send('StoreApi AgaveLab');
});


module.exports = app;