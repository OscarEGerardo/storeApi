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
                if(productFound == null) throw Error(code + ' - Not found');
                total += getPrice(productFound.dataValues.price, counts[productFound.dataValues.code], productFound.dataValues.Promotion);
                return;
            });
        }).then(function (params) {
            res.send({ items: req.body.items, total });
        });
    }).catch(function (error) {
        res.status(400);
        res.send({statusText: error.message});
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
                return price * count;
        }
    }
}

function xForX(price, count, data) {
    var acc = (Math.floor(count / data.buy) * data.pay) * price;
    acc += (count % data.buy) * price;

    return acc;
}

function bulk(price, count, data) {
    if (count >= data.buy)
        return count * data.price;
    else
        return price * count;
}

module.exports = router;