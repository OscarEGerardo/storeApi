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


    models.sequelize.transaction(function (t) {
        return models.sequelize.Promise.map(uniqueArray, function (code) {
            return models.Product.findOne({
                where: {
                    code
                },
                include: [{
                    model: models.Promotion
                }],
                transaction: t
            }).then(function (productFound) {
                total += getPrice(productFound.dataValues.price, counts[productFound.dataValues.code], productFound.dataValues.Promotion);
                return;
            });
        }).then(function (params) {
            res.send({ items: req.body.items, total });
        });
    });
});

function getPrice(price, count, promotion) {
    if (promotion == null)
        return price * count;
    else {
        switch (promotion.dataValues.type) {
            case 'XFORX':
                return xForX(price, count, JSON.parse(promotion.dataValues.data));
            case 'BULK':
                return bulk(price, count, JSON.parse(promotion.dataValues.data));
            default:
                break;
        }
    }
}

function xForX(price, count, data) {
    return price * count;
 }

function bulk(price, count, data) {
    return price * count;
 }

module.exports = router;