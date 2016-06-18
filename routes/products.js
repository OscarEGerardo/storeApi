var express = require('express');
var models = require('../models');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var ProductSchema = {
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
                    require: true
                }
            }
        }
    }
}

router.post('/', validate({ body: ProductSchema }), function (req, res) {
    models.sequelize.transaction(function (t) {
        models.Product.create(
            req.body.product,
            { transaction: t }
        ).then(function (productSaved) {
            if (req.body.promotion == null) {
                res.send(productSaved);
                return;
            };
            models.Promotion.create(req.body.promotion, { transaction: t }).then(function (promotionSaved) {
                return productSaved.setPromotion(promotionSaved);
            }).then(function () {
                res.send(productSaved);
            });
        });
    }).catch(function (error) {
        res.status(400);
        res.send({ statusText: error.message });
    });;
});

module.exports = router;