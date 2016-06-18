var express = require('express');
var models = require('../models');
var linq = require('linq');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var PaymentSchema = {
    type: 'object',
    properties: {
        items: {
            type: 'array',
            required: true,
            items: {
                oneOf: [{
                    type: 'string'
                }]
            }
        }
    },
    additionalProperties: false
};

router.post('/', validate({ body: PaymentSchema }), function (req, res) {
    var counts = [];
    total = 0.00;

    linq.from(req.body.items).select(function (x) {
        counts.push()
        counts[x] = (counts[x] || 0) + 1;
        return x;
    }).toArray();

    uniqueArray = req.body.items.filter(function (item, pos) {
        return req.body.items.indexOf(item) == pos;
    });

    models.sequelize.Promise.map(uniqueArray, function (code) {
        models.Product.findOne({
            where: {
                code
            }
        }).then(function (productFound) {
            var pro = productFound;
        });
    })

    res.send(counts);
});

module.exports = router;