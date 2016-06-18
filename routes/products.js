var express = require('express');
var models = require('../models');
var check = require('check-types');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var ProductSchema = {
    id: '/SimpleProduct',
    type: 'object',
    properties: {
        product: {
            type: 'object',
            required: true,
            properties: {
                code: {
                    type: 'string',
                    required: true,
                    maxLength: 10
                },
                name: {
                    type: 'string',
                    required: true,
                    maxLength: 20
                },
                price: {
                    type: 'decimal',
                    required: true
                }
            }
        },
        promotion: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    required: true,
                    maxLength: 10
                },
                data: {
                    type: 'object',
                    required: true
                }
            }
        }
    }
}

router.get('/', function (req, res) {
    models.Product.findAll({
        include: [{
            model: models.Promotion,
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt']
            }
        }],
        attributes: {
            exclude: ['PromotionId', 'createdAt', 'updatedAt']
        }
    }).then(function (products) {
        res.send(products);
    });
});

router.post('/create', validate({ body: ProductSchema }), function (req, res) {
    models.sequelize.transaction(function (t) {
        return models.Product.create(
            req.body.product,
            { transaction: t }
        ).then(function (productSaved) {
            if (req.body.promotion == null) {
                res.send(productSaved);
                return;
            };
            checkPromotion(req.body.promotion);
            return models.Promotion.create(req.body.promotion, { transaction: t }).then(function (promotionSaved) {
                return productSaved.setPromotion(promotionSaved);
            });
        }).then(function () {
            res.send(productSaved);
        });;
    }).catch(function (error) {
        res.status(400);
        res.send({ statusText: error.name + ' - ' + error.message });
    });
});

function checkPromotion(prom) {
    switch (prom.type) {
        case 'XFORX':
            if (check.integer(prom.data.buy) && check.integer(prom.data.pay))
                break;
            throw Error('Invalid data for XFOX Promotion');
        case 'BULK':
            if (check.integer(prom.data.buy) && check.integer(prom.data.price))
                break;
            throw Error('Invalid data for BULK Promotion');
        default:
            throw Error(prom.type + ' - Not implemented');
    }
}

module.exports = router;