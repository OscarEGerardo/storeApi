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
            },
            additionalProperties: false
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
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
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
                return productSaved;
            };
            checkPromotion(req.body.promotion);
            return models.Promotion.create(req.body.promotion, { transaction: t }).then(function (promotionSaved) {
                return productSaved.setPromotion(promotionSaved, { transaction: t });
            });
        }).then(function (pro) {
            res.send(pro);
        });
    }).catch(function (error) {
        res.status(400);
        res.send({ statusText: error.name == null ? '' : error.name + ' - ' + error.message });
    });
});

router.post('/update', validate({ body: ProductSchema }), function (req, res) {
    models.sequelize.transaction(function (t) {
        return models.Product.findOne({
            where: {
                code: req.body.product.code
            },
            include: [models.Promotion],
            transaction: t
        }).then(function (productFound) {
            if (productFound == null) throw Error(req.body.product.code + ' does not exists');
            if (productFound.Promotion == null || req.body.promotion == null) return updateProd(productFound, req, t);
            checkPromotion(req.body.promotion);

            return productFound.Promotion.updateAttributes({
                type: req.body.promotion.type,
                data: req.body.promotion.data
            }, { transaction: t }).then(function (params) {
                return updateProd(productFound, req, t);
            });
        }).then(function (updated) {
            res.send(updated);
        });
    }).catch(function (error) {
        res.status(400);
        res.send({ statusText: error.name + ' - ' + error.message });
    });
});

function updateProd(productFound, req, t) {
    return productFound.updateAttributes({
        name: req.body.product.name,
        price: req.body.product.price,
        Promotion: req.body.promotion
    }, { transaction: t });
}

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